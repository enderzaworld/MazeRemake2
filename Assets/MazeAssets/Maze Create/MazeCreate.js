#pragma strict
import EventSystems;
import System.Text.RegularExpressions;

var db : dbAccess;
var dbName : String = "myMazeDb.sqdb";
var dbTableName : String = "mazes";
var btnMakeMaze : UI.Button;
var btnLoadMaze : UI.Button;
var btnSaveMaze : UI.Button;
var btnPlayMaze : UI.Button;
var btnAdjustMazeCanvas : UI.Button;
var MazeCanvas : GameObject;
var MazeCell : GameObject;
var Content : GameObject;
var Load : GameObject;
var LoadRow : GameObject;
var MazeSize1 : UI.InputField;
var MazeSize2 : UI.InputField;
//var btnHwalls : UI.Button[][];// = new UI.Button[0][0];
//var btnVwalls : UI.Button[][];// = new UI.Button[0][0];//.SetActive(isShowing);
var MazeMaker : GameObject;
var mazeMakeShow:boolean = false;
var tempGE:boolean = false;
var sizeNum1:int = 3;
var sizeNum2:int = 3;
var upshit:boolean = true;

//---------------need for speed------------------------------------------------------
public static var mazeHWalls : int[,];
public static var mazeVWalls : int[,];
public static var m : int = 3;
public static var n : int = 3;

//public static var mazeHWallsHP : int[,];
//public static var mazeVWallsHP : int[,];
static var mazePathCell:Vector2[] = new Vector2[0];
static var mazeVisitedCell:Vector2[] = new Vector2[0];
//--------------------------------------------------------------------------------------


function Start(){
	try{
		CreateDatabase();
	}catch(e){
		print(e);
	}
}
function OnEnable(){
	MazeMaker.SetActive(mazeMakeShow);
	btnMakeMaze.onClick.AddListener( function () {
		mazeMakeShow=!mazeMakeShow;
		MazeMaker.SetActive(mazeMakeShow);
		Camera.main.GetComponent(MainGUI).showGUI=!mazeMakeShow;
		if(!mazeMakeShow){
			Camera.main.GetComponent(MainGUI).GUIEnabled=tempGE;
		}else{
			tempGE=Camera.main.GetComponent(MainGUI).GUIEnabled;
			Camera.main.GetComponent(MainGUI).GUIEnabled=mazeMakeShow;
		}
	} );
	
	btnLoadMaze.onClick.AddListener( function () {
		
	} );
	
	btnSaveMaze.onClick.AddListener( function () {
		
	} );
	
	btnPlayMaze.onClick.AddListener( function () {
		
	} );
	btnAdjustMazeCanvas.onClick.AddListener( function () {
		upshit=true;
	} );
}

function OnGUI(){
	
}
/*
	var temp_pawn_obj = Instantiate(obj);
	temp_pawn_obj.gameObject.name="0,0";
	temp_pawn_obj.transform.parent=transform;
	if(objList==null){
		objList=new Array();
	}
	objList.Add(temp_pawn_obj);
*/
var button : UI.Button;
var emptyPanel : GameObject;
private var buttonArr : Array;
private var panelArr : Array;
function Update () {
	if(upshit){
	startExist = false;
	endExist = false;
		upshit=false;
		sizeNum1 = IntParseFast(MazeSize1.text);
		sizeNum2 = IntParseFast(MazeSize2.text);
		var row = sizeNum1;
		var col = sizeNum2;
		m = sizeNum1;
		n = sizeNum2;
		
		mazeHWalls = new int[m+1,n];
		mazeVWalls = new int[m,n+1];
		for(var r=0;r<m+1;r++){//hwalls
			for(var c=0;c<n;c++){
				mazeHWalls[r,c]=1;
			}
		}
		for(r=0;r<m;r++){//vwalls
			for(c=0;c<n+1;c++){
				mazeVWalls[r,c]=1;
			}
		}
		
		clearChild(Content.transform);
		
		var temp_Maze_Canvas = Instantiate(MazeCanvas);
		temp_Maze_Canvas.gameObject.name="Maze";
		temp_Maze_Canvas.transform.SetParent(Content.transform);//FindObjectsOfType
		
		for(r=0;r<row;r++){
			for(c=0;c<col;c++){
				var temp_cell = Instantiate(MazeCell);
				//print(r+","+c);
				temp_cell.gameObject.name=r+","+c;
				temp_cell.transform.SetParent(temp_Maze_Canvas.transform);
				
				clearChild(temp_cell.transform);
				
				var emptyPanel1 = Instantiate(emptyPanel);
				emptyPanel1.transform.SetParent(temp_cell.transform);
				
				//if(GameObject.Find("H"+r+","+c)==null){
					var tempoH1 = GameObject.Find("H"+r+","+c);
					if(tempoH1!=null){
						tempoH1.gameObject.name = "(old)H"+r+","+c;
					}
					var H1 : UI.Button = Instantiate(button);
					H1.gameObject.name = "H"+r+","+c;
					H1.transform.SetParent(temp_cell.transform);
					H1.onClick.AddListener( function () {
						print(EventSystem.current.currentSelectedGameObject.name);
						var str : String = changeGetStateH(r,c);
						var text = GameObject.Find(EventSystem.current.currentSelectedGameObject.name).GetComponentInChildren(UI.Text);
							text.text = str;
					} );
				/*}else{
					var emptyPanel6 = Instantiate(emptyPanel);
					emptyPanel6.transform.SetParent(temp_cell.transform);
					emptyPanel6.transform.position = Vector3();
				}*/
				
				var emptyPanel2 = Instantiate(emptyPanel);
				emptyPanel2.transform.SetParent(temp_cell.transform);
				
				//if(GameObject.Find("V"+r+","+c)==null){
					var tempoV1 = GameObject.Find("V"+r+","+c);
					if(tempoV1!=null){
						tempoV1.gameObject.name = "(old)V"+r+","+c;
					}
					var V1 : UI.Button = Instantiate(button);
					V1.gameObject.name = "V"+r+","+c;
					V1.transform.SetParent(temp_cell.transform);
					V1.onClick.AddListener( function () {
						//print(EventSystem.current.currentSelectedGameObject.name);
						var str : String = changeGetStateV(r,c);
						var text = GameObject.Find(EventSystem.current.currentSelectedGameObject.name).GetComponentInChildren(UI.Text);
							text.text = str;
					} );
				/*}else{
					var emptyPanel7 = Instantiate(emptyPanel);
					emptyPanel7.transform.SetParent(temp_cell.transform);
				}*/
				
				var emptyPanel3 = Instantiate(emptyPanel);//<======
				emptyPanel3.transform.SetParent(temp_cell.transform);
				
				//if(GameObject.Find("V"+r+","+(c+1))==null){
					var tempoV2 = GameObject.Find("V"+r+","+(c+1));
					if(tempoV2!=null){
						tempoH1.gameObject.name = "(old)V"+r+","+(c+1);
					}
					var V2 : UI.Button = Instantiate(button);
					V2.gameObject.name = "V"+r+","+(c+1);
					V2.transform.SetParent(temp_cell.transform);
					V2.onClick.AddListener( function () {
						//print(EventSystem.current.currentSelectedGameObject.name);
						var str : String = changeGetStateV(r,c+1);
						var text = GameObject.Find(EventSystem.current.currentSelectedGameObject.name).GetComponentInChildren(UI.Text);
							text.text = str;
					} );
				/*}else{
					var emptyPanel8 = Instantiate(emptyPanel);
					emptyPanel8.transform.SetParent(temp_cell.transform);
				}*/
				
				var emptyPanel4 = Instantiate(emptyPanel);
				emptyPanel4.transform.SetParent(temp_cell.transform);
				
				//if(GameObject.Find("H"+(r+1)+","+c)==null){
					var tempoH2 = GameObject.Find("H"+(r+1)+","+c);
					if(tempoH2!=null){
						tempoH1.gameObject.name = "(old)H"+(r+1)+","+c;
					}
					var H2 : UI.Button = Instantiate(button);
					H2.gameObject.name = "H"+(r+1)+","+c;
					H2.transform.SetParent(temp_cell.transform);
					H2.onClick.AddListener( function () {
						//print(EventSystem.current.currentSelectedGameObject.name);
						var str : String = changeGetStateH(r+1,c);
						var text = GameObject.Find(EventSystem.current.currentSelectedGameObject.name).GetComponentInChildren(UI.Text);
							text.text = str;
					} );
				/*}else{
					var emptyPanel9 = Instantiate(emptyPanel);
					emptyPanel9.transform.SetParent(temp_cell.transform);
				}*/
				
				var emptyPanel5 = Instantiate(emptyPanel);
				emptyPanel5.transform.SetParent(temp_cell.transform);
				
			}
		}
	}
}

function clearChild(temp:Transform){
	for (var child:Transform in temp) {
		GameObject.Destroy(child.gameObject);
	}
}

function getR(string:String):int{
	var rgx:Regex = new Regex("([0-9]*),([0-9]*)");
	var match:System.Text.RegularExpressions.Match = rgx.Match(string);
	if (match.Length>0) {
			return IntParseFast(match.Groups[1].Value);
	}
}
function getC(string:String):int{
	var rgx:Regex = new Regex("([0-9]*),([0-9]*)");
	var match:System.Text.RegularExpressions.Match = rgx.Match(string);
	if (match.Length>0) {
			return IntParseFast(match.Groups[2].Value);
		
	}
}

static var startExist : boolean = false;//mazeHWalls
static var endExist : boolean = false;
function changeGetStateH(row:int,col:int) : String{
	var strName:String = EventSystem.current.currentSelectedGameObject.name;
	print(strName);
	row = getR(strName);
	col = getC(strName);
	print("changeGetStateH:"+row+","+col);
	if(row==0||row==n){
		print("side");
		if(!startExist){
			if(mazeHWalls[row,col]==1){
				mazeHWalls[row,col]=3;
				startExist=true;
				return "S";//"start";
			}
		}else if(!endExist){
			if(mazeHWalls[row,col]==3){
				mazeHWalls[row,col]=1;
				startExist=false;
				return "W";//"wall";
			}else if(mazeHWalls[row,col]==1){
				mazeHWalls[row,col]=2;
				endExist=true;
				return "G";//"end";
			}
		}else{
			if(mazeHWalls[row,col]==3){
				mazeHWalls[row,col]=1;
				startExist=false;
				return "W";//"wall";
			}else if(mazeHWalls[row,col]==2){
				mazeHWalls[row,col]=1;
				endExist=false;
				return "W";//"wall";
			}else{
				return "W";//"no effect";
			}
		}
	}else{
		print("inside");
		if(mazeHWalls[row,col]==1){
			mazeHWalls[row,col]=0;
			return "NW";//"no wall";
		}else 
		if(mazeHWalls[row,col]==0){
			mazeHWalls[row,col]=1;
			return "W";//"wall";
		}
		print("no return");
		return "W";
	}
	print("no return");
	return "W";
}

function changeGetStateV(row:int,col:int) : String{
	var strName:String = EventSystem.current.currentSelectedGameObject.name;
	print(strName);
	row = getR(strName);
	col = getC(strName);
	print("changeGetStateV:"+row+","+col);
	if(col==0||col==n){
		if(!startExist){
			if(mazeVWalls[row,col]==1){
				mazeVWalls[row,col]=3;
				startExist=true;
				return "S";//"start";
			}
		}else if(!endExist){
			if(mazeVWalls[row,col]==3){
				mazeVWalls[row,col]=1;
				startExist=false;
				return "W";//"wall";
			}else if(mazeVWalls[row,col]==1){
				mazeVWalls[row,col]=2;
				endExist=true;
				return "G";//"end";
			}
		}else{
			if(mazeVWalls[row,col]==3){
				mazeVWalls[row,col]=1;
				startExist=false;
				return "W";//"wall";
			}else if(mazeVWalls[row,col]==2){
				mazeVWalls[row,col]=1;
				endExist=false;
				return "W";//"wall";
			}else{
				return "W";//"no effect";
			}
		}
	}else{
		if(mazeVWalls[row,col]==1){
			mazeVWalls[row,col]=0;
			return "NW";//"no wall";
		}else 
		if(mazeVWalls[row,col]==0){
			mazeVWalls[row,col]=1;
			return "W";//"wall";
		}
		print("no return");
		return "W";
	}
	print("no return");
	return "W";
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

static function pushToButtonArray(obj:UI.Button[],item:UI.Button){
var temp = new Array (obj);
temp.Add(item);
obj = temp.ToBuiltin(UI.Button) as UI.Button[];
return obj;
}

static function removeButtonAtArray(obj:UI.Button[],num:int){
var temp = new Array (obj);
temp.RemoveAt(num);
obj = temp.ToBuiltin(UI.Button) as UI.Button[];
return obj;
}

function saveMazeWithCurrent(){
	if(startExist&&endExist){
		SaveMaze(JsonUtility.ToJson(mazeHWalls),JsonUtility.ToJson(mazeVWalls),JsonUtility.ToJson(mazeVisitedCell),JsonUtility.ToJson(mazePathCell),JsonUtility.ToJson(Vector2(m,n)));
		print("done");
	}else{
		print("no start/goal");
	}
}

function CreateDatabase(){
    db = new dbAccess();
    db.OpenDB(dbName);
    var tableName = dbTableName;
    var columnNames = new Array("mazeId","mazeHWalls","mazeVWalls","mazeVisitedCell","mazePathCell","mazeSize");
    //																								n x n
    var columnValues = new Array("INTEGER PRIMARY KEY AUTOINCREMENT","text","text","text","text","text");
    db.CreateTable(tableName,columnNames,columnValues);
    db.CloseDB();
}

function SaveMaze(mazeHWalls:String,mazeVWalls:String,mazeVisitedCell:String,mazePathCell:String,mazeSize:String){
    db = new dbAccess();
    db.OpenDB(dbName);
    var tableName = dbTableName;
    // IMPORTANT remember to add single ' to any strings, do not add them to numbers!
    var columns = new Array("mazeHWalls","mazeVWalls","mazeVisitedCell","mazePathCell","mazeSize");
    var values = new Array("'"+mazeHWalls+"'", "'"+mazeVWalls+"'", "'"+mazeVisitedCell+"'", "'"+mazePathCell+"'", "'"+mazeSize+"'");
    db.InsertIntoSpecific(tableName, columns, values);
    db.CloseDB();
}

function load(numID:String){
    db = new dbAccess();
    db.OpenDB(dbName);
    var tableName = dbTableName;
    // table name, I want to return everyone whose first name is Bob when their last name is = to Sagat, this returs an array
    var mazeHWallsStr = db.SingleSelectWhere(tableName, "mazeHWalls", "mazeId","=",numID); // Remember the '' on String values
    var mazeVWallsStr = db.SingleSelectWhere(tableName, "mazeVWalls", "mazeId","=",numID);
    var mazeVisitedCellStr = db.SingleSelectWhere(tableName, "mazeVisitedCell", "mazeId","=",numID);
    var mazePathCellStr = db.SingleSelectWhere(tableName, "mazePathCell", "mazeId","=",numID);
    var mazeSizeStr = db.SingleSelectWhere(tableName, "mazeSize", "mazeId","=",numID);
    //print(resultArray[0]);
    // of course you can loop through them all if you wish
    db.CloseDB();
    var retAr = new Array(mazeHWallsStr[0],mazeVWallsStr[0],mazeVisitedCellStr[0],mazePathCellStr[0],mazeSizeStr[0]);
    return retAr;
}