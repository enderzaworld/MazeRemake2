#pragma strict

//var l1Text = "This is a label";
//var tf1Text = " ";
var b1Text = "";
var b2Text = "Start Maze";
var b3Text = "Clear Maze";
var b4Text = "Random Maze";
var b5Text = "Toggle Hint";
var b6Text = "Toggle Map";
var b7Text = "Toggle Solution";
var GUIEnabled : boolean = true;
var hwall : GameObject;
var hwallStart : GameObject;
var hwallGoal : GameObject;
var vwall : GameObject;
var vwallStart : GameObject;
var vwallGoal : GameObject;
var floor : GameObject;
var floorHint : GameObject;
var player : GameObject;
//var dummy : GameObject;
public static var mazeCell : int[,];
public static var mazeHWalls : int[,];
public static var mazeVWalls : int[,];
public static var m : int = 4;
public static var n : int = 4;
public static var objList : Array;
public static var hintList : Array;
public static var mazeHWallsHP : int[,];
public static var mazeVWallsHP : int[,];
public static var cheatSolve : boolean = false;
public static var cheatHint : boolean = false;
public static var cheatWallBreak : int = 4;
public static var cheatMap : boolean = false;
static var mazeVisitedCellX = new Array();
static var mazeVisitedCellY = new Array();
static var mazePathCellX = new Array();
static var mazePathCellY = new Array();
static var makeReq = false;

function Start () {

}

function Update () {
	if(makeReq){
		makeMaze();
		makeReq=false;
	}
}

static function toggleMinimap(){
	cheatMap=!cheatMap;
}

function solve(){
	cheatSolve=!cheatSolve;
	print(cheatSolve);
	if(cheatSolve){
		var r:int = -1;
		var c:int = -1;
		for( var i=0; i<mazePathCellX.length && i<mazePathCellY.length ; i++){
			r = mazePathCellX[i];
			c = mazePathCellY[i];
			spawnHint(floorHint,10*r+5,0.001,10*c+5);
		}
		for( i=0; i<mazePathCellX.length && i<mazePathCellY.length ; i++ )
		{
			Debug.Log( mazePathCellX[i]+" , "+mazePathCellY[i] );
		}
		print("spawn end");
	}else{
		removeHint();
		print("spawn removed");
	}
}

function hint(){
	cheatHint=!cheatHint;
	print(cheatHint);
	if(cheatHint){
		var r:int = -1;
		var c:int = -1;
		for( var i=0; i<mazeVisitedCellX.length && i<mazeVisitedCellY.length ; i++){
			r = mazeVisitedCellX[i];
			c = mazeVisitedCellY[i];
			spawnHint(floorHint,10*r+5,0.001,10*c+5);
		}
		for( i=0; i<mazeVisitedCellX.length && i<mazeVisitedCellY.length ; i++ )
		{
			Debug.Log( mazeVisitedCellX[i]+" , "+mazeVisitedCellY[i] );
		}
		print("spawn end");
	}else{
		removeHint();
		print("spawn removed");
	}
}

static function removeHint(){
	if(hintList==null){
		hintList=new Array();
	}
	while(0<hintList.Count){
		Destroy(hintList[0]);
		hintList.RemoveAt(0);
	}
}

static function spawnHint(obj : GameObject ,x : float ,y : float ,z : float){
	var spawn_position : Vector3 = Vector3(x,y,z);
	var temp_pawn_obj = Instantiate(obj, spawn_position, Quaternion.identity);
	if(hintList==null){
		hintList=new Array();
	}
	hintList.Add(temp_pawn_obj);
}

static function spawn(obj : GameObject ,x : float ,y : float ,z : float){
	var spawn_position : Vector3 = Vector3(x,y,z);
	var temp_pawn_obj = Instantiate(obj, spawn_position, Quaternion.identity);
	if(objList==null){
		objList=new Array();
	}
	objList.Add(temp_pawn_obj);
}

function makeMaze(){//2 - goal, 3 - start, 1 - wall
var r : int;
var c : int;
var useHG : boolean = false;
var useHS : boolean = false;
var useVG : boolean = false;
var useVS : boolean = false;

	for(r=0;r<m;r++){//floor
		for(c=0;c<n;c++){/*
			if(cheatHint && isVisited(r,c)){//makefloor cheatHint
				spawnHint(floorHint,10*r+5,0.001,10*c+5);
			}*/
			spawn(floor,10*r+5,0,10*c+5);
		}
	}
	for(r=0;r<m+1;r++){//hwalls
		for(c=0;c<n;c++){
			switch(mazeHWalls[r,c]){
				case 1: spawn(hwall,10*r,2.5,10*c+5);
						break;
				case 2: hwallGoal.transform.position = Vector3(10*r,2.5,10*c+5);
						useHG=true;
						break;
				case 3: hwallStart.transform.position = Vector3(10*r,2.5,10*c+5);
						useHS=true;
						putPlayer(10*r+(5*(1+(2*(-r/(m+1))))),2.5,10*c+5);
						break;
			}
		}
	}
	for(r=0;r<m;r++){//vwalls
		for(c=0;c<n+1;c++){
			switch(mazeVWalls[r,c]){
				case 1: spawn(vwall,10*r+5,2.5,10*c);
						break;
				case 2: vwallGoal.transform.position = Vector3(10*r+5,2.5,10*c);
						useVG=true;
						break;
				case 3: vwallStart.transform.position = Vector3(10*r+5,2.5,10*c);
						useVS=true;
						putPlayer(10*r+5,2.5,10*c+(5*(1+(2*(-c/(n))))));
						break;
			}
		}
	}
	if(!useHG){hwallGoal.transform.position = Vector3(-150,-150,-150);}
	if(!useHS){hwallStart.transform.position = Vector3(-150,-150,-150);}
	if(!useVG){vwallGoal.transform.position = Vector3(-150,-150,-150);}
	if(!useVS){vwallStart.transform.position = Vector3(-150,-150,-150);}
}

function putPlayer(x : float ,y : float ,z : float){
	player.GetComponent.<Rigidbody>().velocity = Vector3(0,0,0);
	player.transform.position = Vector3(x,y,z);
	transform.position = Vector3(x,y,z);
/*	dummy.GetComponent.<Rigidbody>().velocity = Vector3(0,0,0);
	dummy.transform.position = Vector3(x,y,z);*/
}

function detest(){
	mazeVisitedCellX = new Array();
	mazeVisitedCellY = new Array();
	mazePathCellX = new Array();
	mazePathCellY = new Array();
	hwallGoal.transform.position = Vector3(-150,-150,-150);
	hwallStart.transform.position = Vector3(-150,-150,-150);
	vwallGoal.transform.position = Vector3(-150,-150,-150);
	vwallStart.transform.position = Vector3(-150,-150,-150);
	if(objList==null){
		objList=new Array();
	}
	while(0<objList.Count){
		Destroy(objList[0]);
		objList.RemoveAt(0);
	}
}

static var lockRandomMaze = false;

function randomaze(){
var rand = new System.Random();
var mm= rand.Next(3,50);
var nn= rand.Next(3,50);
randomazeTN(mm,nn);
}

function randomazeOn(mn:int){
	if(mn>=3&&mn<=100){
		randomazeTN(mn,mn);
	}else{
		print("fail");
		warningMazeInvalidInput=1000;
	}
}

static var lastNum:int = -1;
static var loadingGui:boolean = false;
function randomazeTN(mm:int,nn:int){
if(!lockRandomMaze){
lockRandomMaze=true;
loadingGui=true;

var rand = new System.Random();
/*try{
	mazeVisitedCellX = new Array();
	mazeVisitedCellY = new Array();
	mazePathCellX = new Array();
	mazePathCellY = new Array();
cheatHint=false;
cheatSolve=false;
}catch(err){ print("random maze clean error");return;}*/

var startX : int = 0;
var startY : int = 0;
var goalX : int = 0;
var goalY : int = 0;
m=mm;
n=nn;
var r=0;
var c=0;
//initialize walls
mazeHWalls = new int[m+1,n];
mazeVWalls = new int[m,n+1];

	for(r=0;r<m+1;r++){//hwalls
		for(c=0;c<n;c++){
			mazeHWalls[r,c]=1;
		}
	}
	for(r=0;r<m;r++){//vwalls
		for(c=0;c<n+1;c++){
			mazeVWalls[r,c]=1;
		}
	}
//end of initial positions

//decide which walls to put the start and the end
var endwallVH = 0;
if(lastNum<0){
	endwallVH = rand.Next(0,1);
	lastNum=endwallVH;
}else{
	lastNum = Mathf.Abs(lastNum-1);
	endwallVH = lastNum;
}
print("zend "+endwallVH);
switch(endwallVH){
	case 0:
		startX = (rand.Next(0,1))*m;
		startY = rand.Next(0,(n-1));
		goalX = m-startX;
		goalY = rand.Next(0,(n-1));
		mazeHWalls[startX,startY]=3;
		mazeHWalls[goalX,goalY]=2;
		goalX--;
		break;
	case 1:
		startX = rand.Next(0,(m-1));
		startY = (rand.Next(0,1))*n;
		goalX = rand.Next(0,(m-1));
		goalY = n-startY;
		mazeVWalls[startX,startY]=3;
		mazeVWalls[goalX,goalY]=2;
		goalY--;
		break;
}
//end of decision

//randomizing maze
mazeHWallsHP = new int[m+1,n];
mazeVWallsHP = new int[m,n+1];
var wallRemoved : int = 0;
	for(r=0;r<m+1;r++){//hwalls
		for(c=0;c<n;c++){
			mazeHWallsHP[r,c]=1;
		}
	}
	for(r=0;r<m;r++){//vwalls
		for(c=0;c<n+1;c++){
			mazeVWallsHP[r,c]=1;
		}
	}
	/*while(wallRemoved<((m*n)*2))*/
	{
		print(startX+" , "+startY+" -> "+goalX+" , "+goalY);
		votingWalls(startX,startY,goalX,goalY);
		for(r=1;r<m;r++){//hwalls
			for(c=0;c<n;c++){
				if(mazeHWallsHP[r,c]<=0){
					mazeHWalls[r,c]=0;
					wallRemoved++;
					}
			}
		}
		for(r=0;r<m;r++){//vwalls
			for(c=1;c<n;c++){
				if(mazeVWallsHP[r,c]<=0){
					mazeVWalls[r,c]=0;
					wallRemoved++;
					}
			}
		}
	}
//end of randomization
makeReq=true;
//makeMaze();
loadingGui=false;
lockRandomMaze=false;
}
}

static function cleaner(){
var rand = new System.Random();
	Debug.Log( "cleaner");
	var num : int;
	for(var r=0;r<m;r++){//cleaning
		for(var c=0;c<n;c++){
			if(!isVisited(r,c)){
				Debug.Log( r+" , "+c);
				num = 3;
				if(r==0){//up
					if(c==0||c==(n-1)){//corner 2 atleast 1 open
						num = 1;
					}else{
						num = 1;
					}
				}
				if(c==0){//left
					if(r==0||r==(n-1)){//corner 2 atleast 1 open
						num = 1;
					}else{
						num = 1;
					}
				}
				if(r==(m-1)){//down
					if(c==0||c==(n-1)){//corner 2 atleast 1 open
						num = 1;
					}else{
						num = 1;
					}
				}
				if(c==(n-1)){//right
					if(r==0||r==(n-1)){//corner 2 atleast 1 open
						num = 1;
					}else{
						num = 1;
					}
				}
				Debug.Log( "num: "+num );
				var available : Array;
				var failSafe:int = 10;
				do{
					available = getAvailableWall(r,c);
					Debug.Log( available.length+">="+(num) );
					if(available.length>num){
						var voteDestroy = rand.Next(0,available.length);
						switch(available[voteDestroy]){
							case 0: mazeHWallsHP[r,c]-=1; break;//up
							case 1: mazeVWallsHP[r,c]-=1; break;//left
							case 2: mazeVWallsHP[r,c+1]-=1; break;//right
							case 3: mazeHWallsHP[r+1,c]-=1; break;//down
						}
					}
					failSafe--;
					if(failSafe<=0)break;
				}while(available.length>num);
			}
		}
	}
}

static function votingWalls(startX : int ,startY : int ,goalX : int ,goalY : int){
var rand = new System.Random();
var dumX : int = 0;
var dumY : int = 0;
dumX=startX;
dumY=startY;
mazeVisitedCellX = new Array();
mazeVisitedCellY = new Array();
mazeVisitedCellX.Add(dumX);
mazeVisitedCellY.Add(dumY);
var stepBack : int = 0;
//here building resumehere
var failSafe:int = m*n;
	while(failSafe>0){
		Debug.Log( dumX+" , "+dumY+" -> "+goalX+" , "+goalY+" ff:"+failSafe);
		failSafe--;
		if(failSafe<=0){break;}
		if(dumX==goalX&&dumY==goalY){
			break;
		}
		var available : Array = new Array();
		stepBack=0;
		do{
			available = getAvailable(dumX,dumY);
			if(available.length==0){
				stepBack++;
				if((mazeVisitedCellX.length-1)-stepBack<0){break;}
				if((mazeVisitedCellY.length-1)-stepBack<0){break;}
				dumX = mazeVisitedCellX[(mazeVisitedCellX.length-1)-stepBack];
				dumY = mazeVisitedCellY[(mazeVisitedCellY.length-1)-stepBack];
			}
			if(stepBack==mazeVisitedCellX.length){
				break;
			}
		}while(available.length==0);
		if(available.length==0){/*
	for( var i=0; i<mazeVisitedCellX.length && i<mazeVisitedCellY.length ; i++ )
	{
		Debug.Log( mazeVisitedCellX[i]+" , "+mazeVisitedCellY[i] );
	}
	Debug.Log( startX+" , "+startY+" -> "+goalX+" , "+goalY);
	Debug.Log( dumX+" , "+dumY);*/
			break;
		}
		
		var voteDestroy = rand.Next(0,available.length);
		switch(available[voteDestroy]){
			case 0: mazeHWallsHP[dumX,dumY]-=1; dumX--; break;//up
			case 1: mazeVWallsHP[dumX,dumY]-=1; dumY--; break;//left
			case 2: mazeVWallsHP[dumX,dumY+1]-=1; dumY++; break;//right
			case 3: mazeHWallsHP[dumX+1,dumY]-=1; dumX++; break;//down
		}
		mazeVisitedCellX.Add(dumX);
		mazeVisitedCellY.Add(dumY);
	}
		cleanSolution();
		Debug.Log("end");
		cleaner();
}

static function cleanSolution(){
var x=1;
//var failSafeClean=mazePathCellX.length;
print("Cleaning Solution");
mazePathCellX = new Array(mazeVisitedCellX);
mazePathCellY = new Array(mazeVisitedCellY);
	for(var i=0;i<mazePathCellX.length-1 && i<mazePathCellY.length-1 /*&& failSafeClean>=0*/;i++){
		if(!isAdjacent(mazePathCellX[i],mazePathCellY[i],mazePathCellX[i+1],mazePathCellY[i+1])){
			print("Cleaning Solution:"+i);
			x=1;
			//var failSafe=mazePathCellX.length;
			if(i-x>=0/*&&failSafe>0*/){
				print("i-x:"+(i-x)+" len:"+mazePathCellX.length);
				while(!isAdjacent(mazePathCellX[i-x],mazePathCellY[i-x],mazePathCellX[i+1],mazePathCellY[i+1])/*&&failSafe>0*/){
					x++;
					if(i-x<0){print("clean current end, next");break;}
					//failSafe--;
					print("x++:"+x);
				}
				for(var ii=0;ii<x;ii++){
					print("remove("+(i-(x-1))+")");
					mazePathCellX.RemoveAt(i-(x-1));
					mazePathCellY.RemoveAt(i-(x-1));
				}
				i-=(x);
			}/*else{
				break;
			}*/
			x=0;
		}
		//failSafeClean--;
	}
print("Cleaning Solution Done");
}

static function isAdjacent(x1:int,y1:int,x2:int,y2:int){
//print(Mathf.Abs(x1-x2)+" || "+Mathf.Abs(y1-y2));
	if((Mathf.Abs(x1-x2)==1f && y1==y2)||(Mathf.Abs(y1-y2)==1f && x1==x2)){
		print("true");
		return true;
	}
	return false;
}

static function isSolVisited(r : int ,c : int){
	for( var i=0; i<mazePathCellX.length && i<mazePathCellY.length ; i++){
		if(mazePathCellX[i] == r && mazePathCellY[i] == c){
			return true;
		}
	}
return false;
}

static function isVisited(r : int ,c : int){
	for( var i=0; i<mazeVisitedCellX.length && i<mazeVisitedCellY.length ; i++){
		if(mazeVisitedCellX[i] == r && mazeVisitedCellY[i] == c){
			return true;
		}
	}
return false;
}

static function getAvailableWall(r : int ,c : int){
var available : Array = new Array();
	if(r!=0 && (mazeHWallsHP[r,c]>=1)){
		available.Add(0);//up
	}
	if(c!=0 && (mazeVWallsHP[r,c]>=1)){
		available.Add(1);//left
	}
	if(c!=(n-1) && (mazeVWallsHP[r,c+1]>=1)){
		available.Add(2);//right
	}
	if(r!=(m-1) && (mazeHWallsHP[r+1,c]>=1)){
		available.Add(3);//down
	}

return available;
}

static function getAvailable(r : int ,c : int){
var available : Array = new Array();
	if(r!=0 && (!isVisited(r-1,c))){
		available.Add(0);//up
	}
	if(c!=0 && (!isVisited(r,c-1))){
		available.Add(1);//left
	}
	if(c!=(n-1) && (!isVisited(r,c+1))){
		available.Add(2);//right
	}
	if(r!=(m-1) && (!isVisited(r+1,c))){
		available.Add(3);//down
	}

return available;
}

function test(){
	randomazeOn(3);
}

static function pD(percent:int , number:int){//percent double
var num:int = ((percent/100f)*number);
	//print(num.ToString());
	return (num);
}

function fixRefresh(){
	try{
		loadingGui=false;
		lockRandomMaze=false;
		detest();
		removeHint();
		cheatHint=false;
		cheatSolve=false;
	}catch(err){ print("clean error");print(err.Message);return;}
}

function  IntParseFast( value : String) : int{
    var result : int = 0;
    for (var i = 0; i < value.Length; i++)
    {
        var letter : char = value[i];
        result = 10 * result + char.GetNumericValue(letter);
    }
    return result;
}

static var number : int = 3;

function radOn(){
	randomazeOn(number);
}

var gearSkin:GUIStyle;
var grayBarSkin:GUIStyle;
var greenBarSkin:GUIStyle;
var lightBlueBarSkin:GUIStyle;

static var numberString:String="3";
public static  var gameMode:String="None";//level random randomLevel
private static var warningMazeInvalidInput : int = 0;
private static var warningMazeInvalidInput1 : int = 0;
private static var warningMazeInvalidInput2 : int = 0;
private static var warningMazeInvalidInput3 : int = 0;
private static var warningMazeInvalidInput4 : int = 0;
private static var warningMazeInvalidInput5 : int = 0;
private static var warningMazeInvalidInput6 : int = 0;
private static var warningMazeInvalidInput7 : int = 0;

function OnGUI(){
if(loadingGui){
	GUI.Label(Rect(0,0,Screen.width,Screen.height), "Loading....", grayBarSkin);
}else{
		GUILayout.BeginArea(new Rect((Screen.width)-pD(7,Screen.width),0,pD(5,Screen.width),pD(5,Screen.width)));
		//print(pD(7,Screen.width));
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b1Text,gearSkin,GUILayout.Width(pD(12,Screen.height)),GUILayout.Height(pD(12,Screen.height)))){
        	GUIEnabled = !GUIEnabled;
		}
		GUILayout.EndHorizontal();
		GUILayout.EndArea();

    if(GUIEnabled) {
		var thread = System.Threading.Thread(function(){});
		GUILayout.BeginArea(new Rect((Screen.width)-pD(70,Screen.width),pD(1,Screen.height),pD(40,Screen.width),Screen.height-pD(5,Screen.height)),greenBarSkin);
		GUILayout.EndArea();
		GUILayout.BeginArea(new Rect((Screen.width)-pD(65,Screen.width),pD(5,Screen.height),pD(40,Screen.width),Screen.height-pD(5,Screen.height)));
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b2Text,lightBlueBarSkin,GUILayout.Width(pD(30,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
			loadingGui=true;
			GUI.Label(Rect(0,0,Screen.width,Screen.height), "Loading....", grayBarSkin);
	        fixRefresh();
        	try{
	        	GUIEnabled = false;
			    thread = System.Threading.Thread(test);
			    thread.Start();
	        	gameMode="level";
        	}catch(err){
        		print(err.Message);
				warningMazeInvalidInput1=1000;
			}
			loadingGui=false;
		}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b3Text,lightBlueBarSkin,GUILayout.Width(pD(30,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
        	fixRefresh();
        	try{
	        	GUIEnabled = false;
        	}catch(err){
				print(err.Message);
				warningMazeInvalidInput2=1000;
			}
		}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b4Text,lightBlueBarSkin,GUILayout.Width(pD(30,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
        	loadingGui=true;
			GUI.Label(Rect(0,0,Screen.width,Screen.height), "Loading....", grayBarSkin);
        	fixRefresh();
        	try{
	        	GUIEnabled = false;
			    thread = System.Threading.Thread(radOn);
			    thread.Start();
	        	gameMode="random";
        	}catch(err){
				print(err.Message);
				warningMazeInvalidInput3=1000;
			}
			loadingGui=false;
		}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b5Text,lightBlueBarSkin,GUILayout.Width(pD(30,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
			try{
				hint();
				GUIEnabled = false;
			}catch(err){
				print(err.Message);
				warningMazeInvalidInput4=1000;
			}
		}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b6Text,lightBlueBarSkin,GUILayout.Width(pD(30,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
			try{
				toggleMinimap();
			}catch(err){
				print(err.Message);
				warningMazeInvalidInput5=1000;
			}
		}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		if(GUILayout.Button(b7Text,lightBlueBarSkin,GUILayout.Width(pD(30,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
			try{
				solve();
				GUIEnabled = false;
			}catch(err){
				print(err.Message);
				warningMazeInvalidInput6=1000;
			}
		}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		numberString = GUILayout.TextField(numberString,10,GUILayout.Width(pD(10,Screen.width)),GUILayout.Height(pD(12,Screen.height)));
		if(GUILayout.Button("Generate",lightBlueBarSkin,GUILayout.Width(pD(19,Screen.width)),GUILayout.Height(pD(12,Screen.height)))){
			loadingGui=true;
			GUI.Label(Rect(0,0,Screen.width,Screen.height), "Loading....", grayBarSkin);
			fixRefresh();
			try{
			number = IntParseFast(numberString);
			}catch(err){
				print(err.Message);
				warningMazeInvalidInput7=1000;
			}
				fixRefresh();
        		try{
				    thread = System.Threading.Thread(radOn);
				    thread.Start();
	        		gameMode="randomLevel";
					GUIEnabled = false;
				}catch(err){
					print(err.Message);
					warningMazeInvalidInput7=1000;
				}
			loadingGui=false;
		}
		GUILayout.EndHorizontal();
    	/*GUILayout.BeginHorizontal();
		GUILayout.Label(l1Text);
		GUILayout.EndHorizontal();

		GUILayout.BeginHorizontal();
		GUILayout.TextField(tf1Text,10);
		GUILayout.EndHorizontal();*/
		GUILayout.EndArea();
    }
    
    if(warningMazeInvalidInput>0){
    	warningMazeInvalidInput--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Invalid Input, Must be a number between 3 and 100",grayBarSkin);
    }
    
    if(warningMazeInvalidInput1>0){
    	warningMazeInvalidInput1--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Generation Failed",grayBarSkin);
    }
    if(warningMazeInvalidInput2>0){
    	warningMazeInvalidInput2--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Failed to clear",grayBarSkin);
    }
    if(warningMazeInvalidInput3>0){
    	warningMazeInvalidInput3--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Generation Failed",grayBarSkin);
    }
    if(warningMazeInvalidInput4>0){
    	warningMazeInvalidInput4--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Hint failure",grayBarSkin);
    }
    if(warningMazeInvalidInput5>0){
    	warningMazeInvalidInput5--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Map failure",grayBarSkin);
    }
    if(warningMazeInvalidInput6>0){
    	warningMazeInvalidInput6--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Solution failure",grayBarSkin);
    }
    if(warningMazeInvalidInput7>0){
    	warningMazeInvalidInput7--;
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), "Generation Failed",grayBarSkin);
    }
    
    if(GameObject.FindWithTag("Player").GetComponent(GoalCollide).playerCollision){
    	var msgString:String = "";
    	var nextNum = 0;
    	if(GameObject.FindWithTag("Player").GetComponent(GoalCollide).celeb<=0){
    		GameObject.FindWithTag("Player").GetComponent(GoalCollide).playerCollision=false;
    		switch(gameMode){
    			case "None":break;
    			case "level":
    				n++;
    				nextNum = n;
    				fixRefresh();
    				randomazeOn(nextNum);
    				break;
    			case "random":
    				randomaze();
    				break;
    			case "randomLevel":
    				n++;
    				nextNum = n;
    				fixRefresh();
    				randomazeOn(nextNum);
    				break;
    			default:break;
    		}
    	}else{
    		GameObject.FindWithTag("Player").GetComponent(GoalCollide).celeb--;
    	}//None level random randomLevel
    	print(gameMode);
    	switch(gameMode){
    		case "None":break;
    		case "level":
    			msgString="Congrats!! Onto the next level!!!";
    			break;
    		case "random":
    			msgString="Congrats!! Onto the next random maze!!!";
    			break;
    		case "randomLevel":
    			msgString="Congrats!! Onto the next random level!!!";
    			break;
    		default:break;
    	}
    	GUI.Label(Rect(pD(25,Screen.width),pD(25,Screen.height),pD(50,Screen.width),pD(50,Screen.height)), msgString, grayBarSkin);
    }
}
}