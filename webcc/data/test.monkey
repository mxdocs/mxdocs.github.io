' Imports:
Import monkey.stack

' Functions:
Function Main:Int()
	Local S:= New IntStack()

	For Local I:= 1 To 10
		S.Push(I)
	Next

	For Local X:= EachIn S
		Print(X)
	Next

	S.Clear()

	' Return the default response.
	Return 0
End