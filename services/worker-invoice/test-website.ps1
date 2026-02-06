$url = "https://SponsorHunt.net"
Start-Process "chrome.exe" $url
Start-Sleep -Seconds 5

# Using SendKeys to interact (Tab to input, Type, Enter)
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.SendKeys]::SendWait("{TAB}") 
Start-Sleep -Milliseconds 500
[System.Windows.Forms.SendKeys]::SendWait("{TAB}") 
Start-Sleep -Milliseconds 500
[System.Windows.Forms.SendKeys]::SendWait("youtube.com/@mkbhd")
Start-Sleep -Seconds 1
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
