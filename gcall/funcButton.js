(function () {
    const position = '<%=position%>';
    let linkCSS = document.createElement('link');
    linkCSS.setAttribute('rel', 'stylesheet');
    linkCSS.setAttribute('type', 'text/css');
    linkCSS.setAttribute('href', 'https://button.gcall.vn/static/css/click-to-call.css');
    let linkJsSIP = document.createElement('script');
    linkJsSIP.setAttribute('src', 'https://button.gcall.vn/static/js/jssip-3.2.4.min.js');

    document.head.appendChild(linkCSS);
    document.head.appendChild(linkJsSIP);

    let callContainer = document.createElement("div");
    callContainer.classList.add("smart-gcalls");
    callContainer.classList.add(position);
    callContainer.setAttribute('data-tooltip', '<%=content%>');
    document.body.appendChild(callContainer);
    callContainer.addEventListener('click', function () {
        makeCall();
    });
    callContainer.style.display = 'none';
    let tooltipElement = document.createElement('span');
    tooltipElement.classList.add('smart-gcalls-tooltip');
    callContainer.appendChild(tooltipElement);
    let tooltipHeader = document.createElement('p');
    tooltipHeader.classList.add('tooltip-header');
    tooltipHeader.innerText = '<%=header%>'
    let tooltipContent = document.createElement('p');
    tooltipContent.classList.add('tooltip-content');
    tooltipContent.innerText = '<%=content%>'
    tooltipElement.appendChild(tooltipHeader);
    tooltipElement.appendChild(tooltipContent);

    const sip = {
        extension: '<%=extension%>',
        password: '<%=password%>',
        domain: '<%=domain%>',
        websocket: '<%=websocket%>',
        destination: '<%=destination%>'
    };
    let callboxElement = document.createElement('div');
    callboxElement.classList.add('callbox-gcalls');
    document.body.appendChild(callboxElement);
    callboxElement.style.visibility = 'hidden';
    let infoContainer = document.createElement('div');
    infoContainer.classList.add('info');
    callboxElement.appendChild(infoContainer);
    let nameContainer = document.createElement('div');
    nameContainer.classList.add('name');
    let textElement = document.createElement('p');
    textElement.innerText = '<%=header%>';
    nameContainer.appendChild(textElement);
    infoContainer.appendChild(nameContainer);
    let statusContainer = document.createElement('div');
    statusContainer.classList.add('status');
    statusContainer.innerText = 'Calling...';
    infoContainer.appendChild(statusContainer);
    let hangupBtn = document.createElement('button');
    hangupBtn.classList.add('hangup');
    callboxElement.appendChild(hangupBtn);
    hangupBtn.addEventListener('click', hangup);
    let remoteView = document.createElement('video');
    remoteView.setAttribute('autoplay', true);
    remoteView.style.display = 'none';
    callboxElement.appendChild(remoteView);
    let soundPlayer = document.createElement("audio");
    soundPlayer.volume = 1;

    let durationInterval, countTime, ua, _session, calling = false;
    let JsSIPInterval;

    JsSIPInterval = setInterval(function () {
        console.log('check if jssip undefined');
        if (!!JsSIP) {
            console.log('JsSIP is loaded');
            startUA();
            clearInterval(JsSIPInterval);
        }
    }, 4000);

    function playSound(sound_file) {
        soundPlayer.setAttribute("src", 'https://button.gcall.vn/static/sounds/' + sound_file);
        soundPlayer.play();
    };

    function startUA() {
        let socket = new JsSIP.WebSocketInterface('wss://<%=websocket%>');
        socket.via_transport = "wss";
        ua = new JsSIP.UA({
            uri: sip.extension + '@' + sip.domain,
            password: sip.password,
            display_name: sip.extension,
            sockets: [socket],
            registrar_server: null,
            contact_uri: null,
            authorization_user: null,
            instance_id: null,
            session_timers: false,
            use_preloaded_route: false
        });

        ua.start();

        ua.on('connecting', function (e) {
            console.log('connecting');
        });

        ua.on('connected', function (e) {
            console.log('connected');
        });

        ua.on('disconnected', function (e) {
            console.log('disconnected');
        });

        ua.on('newRTCSession', function (data) {
            console.log('newRTCSession');
            let session = data.session;
            if (calling || session.direction === "incoming") return;
            calling = true;
            callContainer.style.display = 'none';
            _session = session;

            session.on('connecting', function (e) {
                console.log('connecting');
            });

            session.on('sending', function (e) {
                console.log('sending');
            });

            session.on('progress', function (e) {
                console.log('progress');
                if (e.originator === 'remote') {
                    soundPlayer.loop = true;
                    playSound("sounds/outgoing-call2.ogg");
                }
            });

            session.on('accepted', (e) => {
                console.log('accepted call', e);
                countTime = 0;
                let peerconnection = session.connection;
                let localStream = peerconnection.getLocalStreams()[0];
                let remoteStream = peerconnection.getRemoteStreams()[0];

                durationInterval = setInterval(function () {
                    countTime += 1;
                    let minutes = Math.floor(countTime / 60);
                    let seconds = Math.floor(countTime % 60);
                    let duration = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
                    statusContainer.innerText = duration;
                }, 1000);

                // If incoming all we already have the remote stream
                if (remoteStream) {
                    console.log('already have a remote stream');

                    handleRemoteStream(remoteStream);
                }

                peerconnection.addEventListener('addstream', function (event) {
                    console.log('peerconnection "addstream" event');

                    handleRemoteStream(event.stream);
                });
            });

            session.on('confirmed', function (e) {
                console.log('confirmed', e);
            });

            session.on('failed', function (e) {
                console.log('failed call', e);
                callboxElement.style.visibility = 'hidden';
                callContainer.style.display = 'block';
                _session = null;
                calling = false;
            });

            session.on('ended', function (e) {
                console.log('ended call', e);
                clearInterval(durationInterval);
                callboxElement.style.visibility = 'hidden';
                callContainer.style.display = 'block';
                statusContainer.innerText = 'Calling...';
                _session = null;
                calling = false;
            });
        });

        ua.on('newMessage', function (e) {
            console.log('newMessage');
        });

        ua.on('registered', function (e) {
            console.log('registered');
            callContainer.style.display = 'block';
            if (nameContainer.scrollWidth > nameContainer.offsetWidth) {
                textElement.classList.add('make-it-flow');
            }
            callContainer.classList.add('hover');
            setTimeout(function () {
                callContainer.classList.remove('hover');
                setInterval(function () {
                    callContainer.classList.add('hover');
                    setTimeout(function () {
                        callContainer.classList.remove('hover');
                    }, 3000);
                }, 30000);
            }, 3000);
        });

        ua.on('unregistered', function (e) {
            console.log('unregistered');
        });

        ua.on('registrationFailed', function (e) {
            console.log('registrationFailed', e);
        });
    }

    function makeCall() {
        callboxElement.style.visibility = 'visible';
        ua.call(sip.destination, {
            mediaConstraints: { audio: true, video: false },
            rtcOfferConstraints: {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 0
            }
        });
    }

    function hangup() {
        if (_session) {
            _session.terminate();
        }
    }

    function handleRemoteStream(stream) {
        console.log('handleRemoteStream() [stream]');

        // Display remote stream
        remoteView.srcObject = stream;

        stream.addEventListener('addtrack', (event) => {
            let track = event.track;
            if (remoteView.srcObject !== stream)
                return;
            console.log('remote stream "addtrack" event [track]');
            // Refresh remote video
            remoteView.srcObject = stream;
            track.addEventListener('ended', () => {
                console.log('remote track "ended" event [track]');
            });
        });

        stream.addEventListener('removetrack', () => {
            if (remoteView.srcObject !== stream)
                return;

            console.log('remote stream "removetrack" event');

            // Refresh remote video
            remoteView.srcObject = stream;
        });
    }
})();
