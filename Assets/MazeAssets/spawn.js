#pragma strict

var cube : GameObject;
static var selectedTransform : Transform;
static var spawn_position : Vector3;
static var objList : Array;
var timer = 0.0;
var timer1 = 0.0;
var dtime = 50.0;

function spawn () {
spawn_position = Vector3(0,0,0);
var temp_pawn_cube = Instantiate(cube, spawn_position, Quaternion.identity);
if(objList==null){
	objList=new Array();
}
objList.Add(temp_pawn_cube);
selectedTransform = temp_pawn_cube.transform;
selectedTransform.Rotate(0,90*((Time.realtimeSinceStartup/10)-1),0);
}

function despawn () {
if(objList==null){
	objList=new Array();
}
Destroy(objList[0]);
objList.RemoveAt(0);
}

function Start () {

}

function Update () {
timer += Time.deltaTime;
timer1 += Time.deltaTime;
	if(timer > 10){
		spawn();
		timer = 0.0;
	}
	if(timer1 > dtime){
		despawn();
		timer1 = 0.0;
		dtime = 10;
	}
}