Set-ExecutionPolicy Bypass -Scope Process

$REMOTE_USER = "REMOTE_USER" 
$REMOTE_HOST = "REMOTE_HOST"
$REMOTE_PORT = "REMOTE_PORT"

$ssh_command = "ssh -p $REMOTE_PORT -o BatchMode=yes -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST exit"

try {
    # SSH 접속 확인
    cmd.exe /c $ssh_command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH connection successful."

        
    }
} catch {
    Write-Host "An error occurred: $_"
}