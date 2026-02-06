Start-Process "chrome.exe" "--new-window https://SponsorHunt.net"
Start-Sleep -Seconds 8

Add-Type -AssemblyName System.Windows.Forms
# Tab 3 times to reach the Input Box (usually)
[System.Windows.Forms.SendKeys]::SendWait("{TAB}") 
Start-Sleep -Milliseconds 500
[System.Windows.Forms.SendKeys]::SendWait("{TAB}") 
Start-Sleep -Milliseconds 500
[System.Windows.Forms.SendKeys]::SendWait("youtube.com/pewdiepie")
Start-Sleep -Seconds 1
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
