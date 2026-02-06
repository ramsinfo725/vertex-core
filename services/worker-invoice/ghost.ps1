Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.SendKeys]::SendWait("^{ESC}")
Start-Sleep -Seconds 1
[System.Windows.Forms.SendKeys]::SendWait("notepad")
Start-Sleep -Seconds 1
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Seconds 2
[System.Windows.Forms.SendKeys]::SendWait("Hello Ram!{ENTER}")
[System.Windows.Forms.SendKeys]::SendWait("This is Tril controlling your PC.{ENTER}")
[System.Windows.Forms.SendKeys]::SendWait("The Digital Worker is alive.")
