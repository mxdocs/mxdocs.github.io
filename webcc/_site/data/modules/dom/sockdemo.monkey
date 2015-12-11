
Import dom

Class MyApp Extends EventListener

	Field sock:WebSocket

	Method New()
	
		'This is the only server I can find that seems to work!
		sock=createWebSocket( "ws://echo.websocket.org" )
		
		sock.addEventListener("open", Self)
		sock.addEventListener("close", Self)
		sock.addEventListener("message", Self)
		sock.addEventListener("error", Self)
		
		#Rem
			sock.addEventListener("onopen", Self)
			sock.addEventListener("onclose", Self)
			sock.addEventListener("onmessage", Self)
			sock.addEventListener("onerror", Self)
		#End
		
		Print "Connecting..."
	End
	
	Method handleEvent( ev:Event )
		Print("ev.type: " + ev.type)
		
		Select ev.type
		Case "onopen", "open"
			Print "WebSocket open!"
			sock.send "~qTesting, testing, 1, 2, 3...~q"
		Default
			'DebugStop()
		'Case "message"
			Print MessageEvent( ev ).data
		End
	End

End

Function Main()

	New MyApp

End

