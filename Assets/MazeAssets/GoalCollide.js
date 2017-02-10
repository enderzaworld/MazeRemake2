#pragma strict
public var playerCollision : boolean = false;
public var celeb : int = 0;
 
 function OnCollisionEnter (hit : Collision)
 {
   if (hit.gameObject.tag == "Finish")
   {
     //audio.PlayOneShot (impact);
     playerCollision = true;
     celeb = 200;
     print("yeah");
   } else 
   {
     playerCollision = false;
   }
 }