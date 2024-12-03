Set-ExecutionPolicy Bypass -Scope Process

#$LOCAL_SCRIPT_DIR = (Get-Location).Path # 동작 불가
$LOCAL_SCRIPT_DIR = "LOCAL_SCRIPT_DIR"
$LOCAL_ROOT_DIR = Split-Path -Path $LOCAL_SCRIPT_DIR -Parent
$FRONT_PORT = "FRONT_PORT"
$REMOTE_USER = "REMOTE_USER" 
$REMOTE_HOST = "REMOTE_HOST"
$REMOTE_PORT = "REMOTE_PORT"

$REMOTE_PATH = "REMOTE_PATH" 

$LOG_DIR = "LOG_DIR"     # 로그 파일 저장 경로
$CURRENT_DATE = (Get-Date).ToString("yyyyMMdd_hhmmss")
$TOMCAT_LOG_FILE = "log_$CURRENT_DATE.log"

# SSH 접속 확인
$ssh_command = "ssh -p $REMOTE_PORT -o BatchMode=yes -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST exit"

try {
    # SSH 접속 확인
    cmd.exe /c $ssh_command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH connection successful."

        Write-Host "Starting the restart of the remote server..."

        # SSH commands
        $commands_01 = @(
            "$REMOTE_PATH/bin/shutdown.sh",
            "$REMOTE_PATH/bin/startup.sh > $LOG_DIR/$TOMCAT_LOG_FILE 2>&1 &"
        )

        foreach ($command in $commands_01) {
            ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" $command
        }

        Write-Host "Restart of the remote server completed successfully."
    }
} catch {
    Write-Host "An error occurred: $_"
}
