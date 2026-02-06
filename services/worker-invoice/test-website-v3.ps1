Start-Process "chrome.exe"
Start-Sleep -Seconds 2
Add-Type -AssemblyName System.Windows.Forms

# Go to Address Bar
[System.Windows.Forms.SendKeys]::SendWait("%d") 
Start-Sleep -Milliseconds 500
[System.Windows.Forms.SendKeys]::SendWait("https://sponsorhunt.net{ENTER}")

# Wait for load
Start-Sleep -Seconds 8

# Tab to input
[System.Windows.Forms.SendKeys]::SendWait("{TAB}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{TAB}")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("youtube.com/mrbeast")
Start-Sleep -Seconds 1
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
