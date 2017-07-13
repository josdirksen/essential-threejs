(function(THREE) {
    /**
     * Display World Coordinate in the corner.
     *
     * @author luics https://github.com/luics
     * @param rawCamera {THREE.Camera}
     * @param [opt] {Object}
     * @constructor
     * @class
     *
     * @see https://codepen.io/jerryasher/pen/qOKgeM
     */
    const WorldCoordinate = THREE.WorldCoordinate = function(rawCamera, opt) {
        opt = opt || {};
        opt.target = opt.target || new THREE.Vector3();
        opt.width = opt.width || 200;
        opt.height = opt.height || 200;
        this._rawCamera = rawCamera;
        this._opt = opt;
        // TODO support corner direction

        var container, camera, scene, renderer;

        container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute', left: '0', bottom: '0', margin: '20px', zIndex: '1000',
            width: opt.width + 'px',
            height: opt.height + 'px',
            border: '1px solid #999',
            backgroundColor: '#fff'
        });
        document.body.appendChild(container);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xf0f0f0, 1);
        renderer.setSize(opt.width, opt.height);
        container.appendChild(renderer.domElement);
        renderer.domElement.addEventListener('touchstart', function() {
            // TODO reset rawCamera
            // if (opt.rawCameraPosition && opt.rawCameraLookAt) {
            //     rawCamera.position = opt.rawCameraPosition;
            //     rawCamera.lookAt(opt.rawCameraLookAt);
            //     rawCamera.updateProjectionMatrix();
            // }
        }, false);

        camera = new THREE.PerspectiveCamera(50, opt.width / opt.height, 1, 1000);
        camera.up = rawCamera.up; // important!

        scene = new THREE.Scene();
        scene.add(new THREE.AxisHelper(opt.width / 2));

        this._scene = scene;
        this._camera = camera;
        this._renderer = renderer;
    };

    Object.assign(WorldCoordinate.prototype, {
        update: function() {
            this._camera.position.copy(this._rawCamera.position);
            this._camera.position.sub(this._opt.target); // added by @libe
            this._camera.position.setLength(this._opt.width * 1.5);
            this._camera.lookAt(this._scene.position);

            this._renderer.render(this._scene, this._camera);
        }
    });
})(THREE);