using System;
using UnityEngine;
using UnityEngine.EventSystems;

namespace UnityStandardAssets.CrossPlatformInput
{
	public class Joystick : MonoBehaviour, IPointerDownHandler, IPointerUpHandler, IDragHandler
	{
		public enum AxisOption
		{
			// Options for which axes to use
			Both, // Use both
			OnlyHorizontal, // Only horizontal
			OnlyVertical // Only vertical
		}

		public int MovementRange = 100;
		public AxisOption axesToUse = AxisOption.Both; // The options for the axes that the still will use
		public string horizontalAxisName = "Horizontal"; // The name given to the horizontal axis for the cross platform input
		public string verticalAxisName = "Vertical"; // The name given to the vertical axis for the cross platform input

		Vector3 m_StartPos;
		bool m_UseX; // Toggle for using the x axis
		bool m_UseY; // Toggle for using the Y axis
		CrossPlatformInputManager.VirtualAxis m_HorizontalVirtualAxis; // Reference to the joystick in the cross platform input
		CrossPlatformInputManager.VirtualAxis m_VerticalVirtualAxis; // Reference to the joystick in the cross platform input

		void OnEnable()
		{
			CreateVirtualAxes();
		}

        void Start()
        {
            m_StartPos = transform.position;
        }

		void UpdateVirtualAxes(Vector3 value)
		{
			var delta = m_StartPos - value;
			delta.y = -delta.y;
			delta /= MovementRange;
			if (m_UseX)
			{
				m_HorizontalVirtualAxis.Update(-delta.x);
			}

			if (m_UseY)
			{
				m_VerticalVirtualAxis.Update(delta.y);
			}
		}

		void CreateVirtualAxes()
		{
			// set axes to use
			m_UseX = (axesToUse == AxisOption.Both || axesToUse == AxisOption.OnlyHorizontal);
			m_UseY = (axesToUse == AxisOption.Both || axesToUse == AxisOption.OnlyVertical);

			// create new axes based on axes to use
			if (m_UseX)
			{
				m_HorizontalVirtualAxis = new CrossPlatformInputManager.VirtualAxis(horizontalAxisName);
				CrossPlatformInputManager.RegisterVirtualAxis(m_HorizontalVirtualAxis);
			}
			if (m_UseY)
			{
				m_VerticalVirtualAxis = new CrossPlatformInputManager.VirtualAxis(verticalAxisName);
				CrossPlatformInputManager.RegisterVirtualAxis(m_VerticalVirtualAxis);
			}
		}
		/*
		public float slope(Vector2 p1,Vector2 p2){
			return (float)((p2.y-p1.y)/(p2.x-p1.x));
		}

		public float distance(Vector2 p1,Vector2 p2){
			float m = slope (p1,p2);
			return Mathf.Sqrt(((m*(p1.x-p2.x)+p1.y)*(m*(p1.x-p2.x)+p1.y))+(p2.x*p2.x));
		}*/
		/*
		public Vector2 clampV2MaxMin(Vector2 p2,float radius){
			Vector2 p1 = new Vector2 (m_StartPos.x,m_StartPos.y);
			//print (Vector2.Distance(p1,p2)+" > "+radius);
			if(Vector2.Distance(p1,p2)>radius){
				//print (Vector2.Distance(p1,p2)+" > "+radius);
				Vector3 P = Vector3.Lerp(p1, p2, radius / (p1-p2).Length());
				Vector2 p3 = new Vector2 (0,0);
				float m = slope (p1,p2);
				float k = distance(p1,p2)/Mathf.Sqrt(1+(m*m));
				p3.x=p1.x+k;
				p3.y=p1.y+(k*m);
				return p3;
			}
			return p2;
		}*/
		
		public Vector3 LerpByDistance(Vector3 A, Vector3 B, float x)
		{
			if (Vector2.Distance (A, B) > x) {
				Vector3 P = x * Vector3.Normalize (B - A) + A;
				return P;
			}
			return B;
		}

		public void OnDrag(PointerEventData data)
		{
			Vector3 newPos = Vector3.zero;

			/*
			if (m_UseX)
			{
				int delta = (int)(data.position.x - m_StartPos.x);
				delta = Mathf.Clamp(delta, - MovementRange, MovementRange);
				newPos.x = delta;
			}

			if (m_UseY)
			{
				int delta = (int)(data.position.y - m_StartPos.y);
				delta = Mathf.Clamp(delta, -MovementRange, MovementRange);
				newPos.y = delta;
			}*/

			if (m_UseX || m_UseY) {
				//float distance = Vector3.Distance(new Vector3(data.position.x,data.position.y,m_StartPos.z),m_StartPos);
				Vector2 delta = LerpByDistance(m_StartPos, data.position, MovementRange);
				newPos = delta;
			}
			transform.position = new Vector3(/*m_StartPos.x + */newPos.x, /*m_StartPos.y + */newPos.y, m_StartPos.z/* + newPos.z*/);
			UpdateVirtualAxes(transform.position);
		}


		public void OnPointerUp(PointerEventData data)
		{
			transform.position = m_StartPos;
			UpdateVirtualAxes(m_StartPos);
		}


		public void OnPointerDown(PointerEventData data) { }

		void OnDisable()
		{
			// remove the joysticks from the cross platform input
			if (m_UseX)
			{
				m_HorizontalVirtualAxis.Remove();
			}
			if (m_UseY)
			{
				m_VerticalVirtualAxis.Remove();
			}
		}
	}
}