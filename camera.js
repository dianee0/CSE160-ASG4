class Camera{
    constructor(aspectRatio, near, far){
        this.fov = 60;
        this.eye = new Vector3([0,1,5]);
        this.at = new Vector3([0,0,0]);
        this.up = new Vector3([0,1,0]);

        //Pass the view Matrix
        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],  
            this.at.elements[0],this.at.elements[1],this.at.elements[2],  
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );

        this.projMat = new Matrix4();

        this.projMat.setPerspective(this.fov, aspectRatio, near, far);
    }

    moveForward(speed) {
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize().mul(speed);
        this.eye.add(f);
        this.at.add(f);
        this.updateviewMat();
    }

    moveBackward(speed) {
        let b = new Vector3();
        b.set(this.eye).sub(this.at).normalize().mul(speed);
        this.eye.add(b);
        this.at.add(b);
        this.updateviewMat();
    }

    moveLeft(speed) {
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let s = Vector3.cross(this.up, f).normalize().mul(speed);
        this.eye.add(s);
        this.at.add(s);
        this.updateviewMat();
    }

    moveRight(speed) {
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let s = Vector3.cross(f, this.up).normalize().mul(speed);
        this.eye.add(s);
        this.at.add(s);
        this.updateviewMat();
    }

    panLeft(alpha) {
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let rotationMatrix = new Matrix4().setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rotationMatrix.multiplyVector3(f);
        this.at = new Vector3(this.eye.elements).add(f_prime);
        this.updateviewMat();
    }

    panRight(alpha) {
        this.panLeft(-alpha);
    }

    panUp(angle) {
        // Compute the right vector
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let right = Vector3.cross(f, this.up).normalize();
    
        // Create a rotation matrix around the right vector
        let rotationMatrix = new Matrix4().setRotate(angle, right.elements[0], right.elements[1], right.elements[2]);
    
        // Rotate the forward vector
        let f_prime = rotationMatrix.multiplyVector3(f);
    
        // Update the at and up vectors
        this.at = new Vector3(this.eye.elements).add(f_prime);
        this.up = Vector3.cross(right, f_prime).normalize();
    
        this.updateviewMat();
    }

    updateviewMat() {
        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }
}