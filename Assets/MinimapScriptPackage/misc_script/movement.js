
private var startPos:Vector3;

function Start(){
	startPos=transform.position;
}

function Update () {

	transform.position.x=startPos.x+5*Mathf.Sin(Time.time*1);
	transform.position.z=startPos.z+5*Mathf.Sin(Time.time*2);

}