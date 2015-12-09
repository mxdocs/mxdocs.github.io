Strict

Import mojo

Function Main:Int()
	New MyApp()
	Return 0
End

Class MyApp Extends App
	Field wobblyScrollingText:WobblyScrollingText
	
	Field circleScroller:CircleScroller 
	
	Method OnCreate:Int()
		wobblyScrollingText = New WobblyScrollingText("O______O", DeviceWidth(), DeviceHeight() / 2)
		
		circleScroller = New CircleScroller()
		
		SetUpdateRate(60)
		Return 0
	End
	
	Method OnUpdate:Int()
		wobblyScrollingText.Update()
		circleScroller.Update()
		Return 0
	End
	
	Method OnRender:Int()
		Cls
		wobblyScrollingText.Print()
		circleScroller.Render()
		Return 0
	End
End

Class WobblyScrollingText
	Field text:String
	Field x:Float, y:Float, oy:Float
	Field fontSize:Int = 8
	Field speed:Float
		
	Method New(text:String, x:Float, y:Float, speed:Float = 3)
		Self.x = x
		Self.y = y
		Self.oy = y
		Self.text = text
		Self.speed = 3
	End
	
	Method Update:Void()
		x -= speed
		y = oy + Cos(x) * 50
		If x + text.Length() * fontSize < 0 Then x = DeviceWidth()
	End
	
	Method Print:Void()
		DrawText(text, x, y, 0, .5)
	End
End

Class Letter
	Field rad:Float, angl:Float, letter:Int, rados:Float
	Field myList:List<Letter>

	Method New(myChar:Int)
		self.rad = 170
		self.angl = -90
		self.letter = myChar
	End

	Method SetList:Void(aList:List<Letter>)
		myList = aList
	End

	Method Update:Void()
		angl += CircleScroller.scrollSpeed
		rados = Cos(angl * 3 + CircleScroller.rotangl) * 40
		If angl > 270
			myList.Remove(Self)
		End 
	End

	Method Render:Void()
		Local x:Float = Cos(angl) * (rad + rados)
		Local y:Float = Sin(angl) * (rad + rados)

		Local myAlpha:Float = 1
		If angl < -45
			myAlpha = (90.0+angl)/45.0
		Else If angl > 225
			myAlpha = (270.0-angl)/45.0
		End

		SetAlpha myAlpha
		DrawText (String.FromChar(letter), x + 320 , -y + 240)
	End
End

Class CircleScroller Extends List<Letter>
	Global scrollSpeed:Float = .6
	Global rotangl:Float = 0
	Global scrollytext:String = "Hello Monkey World!     "
	Global textPointer:Int = 0
	Global letterDelay:Int = 0

	Method New()
	End
	
	Method Update:Void()
		rotangl += scrollSpeed
		rotangl = rotangl Mod 360

		letterDelay += 1
		If letterDelay > 10
			Local myLetter:Letter =  New Letter( scrollytext[textPointer] )
			myLetter.SetList(Self)
			AddLast myLetter
			textPointer = (textPointer + 1) Mod scrollytext.Length()
			letterDelay = 0
		End

		For Local letter:Letter = Eachin Self
			letter.Update()
		Next
	End
	
	Method Render:Void()
		For Local letter:Letter = Eachin Self
			letter.Render()
		Next
	End
End