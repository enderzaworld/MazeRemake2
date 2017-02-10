

function Start(){

}

function Update () {

	if(Input.GetButton("Horizontal")){
		transform.rotation.eulerAngles.y+=3.5*Input.GetAxisRaw("Horizontal");
	}
	if(Input.GetButton("Vertical")){
		transform.Translate(Vector3.forward*Input.GetAxisRaw("Vertical")*7*Time.deltaTime);
	}

}