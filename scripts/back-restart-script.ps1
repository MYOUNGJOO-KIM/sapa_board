Set-ExecutionPolicy Bypass -Scope Process

#$LOCAL_SCRIPT_DIR = (Get-Location).Path # 동작 불가
$LOCAL_SCRIPT_DIR = "LOCAL_SCRIPT_DIR"
$LOCAL_ROOT_DIR = Split-Path -Path $LOCAL_SCRIPT_DIR -Parent

$LOCAL_PATH = Join-Path -Path $LOCAL_ROOT_DIR -ChildPath "backend"
$LOCAL_TARGET_PATH = Join-Path -Path $LOCAL_PATH -ChildPath "target"
$BACK_PORT = "8085"
$REMOTE_USER = "REMOTE_USER"
$REMOTE_HOST = "REMOTE_HOST"
$REMOTE_PORT = "REMOTE_PORT"

$REMOTE_PATH="REMOTE_PATH"
$JAVA_HOME="JAVA_HOME"
$JAR_FILE_NM="JAR_FILE_NM"
$LOCAL_JAR_PATH = Join-Path -Path $LOCAL_TARGET_PATH -ChildPath $JAR_FILE_NM

$UPLOADS_DIR_NM="uploads"

$LOG_DIR = "LOG_DIR"     # 로그 파일 저장 경로
$LOG_DB_DIR = "LOG_DB_DIR"
$CURRENT_DATE = (Get-Date).ToString("yyyyMMdd_HHmmss")
$JAVA_LOG_FILE = "log_${CURRENT_DATE}.log"
$MARIADB_LOG_FILE = "log_$CURRENT_DATE.log"

$ssh_command = "ssh -p $REMOTE_PORT -o BatchMode=yes -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST'"

try {
    # SSH 접속 시도
    cmd.exe /c $ssh_command
    Write-Host "SSH connection successful."
    
    Write-Host "Starting the restart of the remote server..."
    
    # SSH commands
    $commands_01 = @(
        "fuser -k $BACK_PORT/tcp",
        "systemctl stop mariadb",
        "systemctl start mariadb",
        "nohup tail -f /var/log/mysql/error.log > '$LOG_DB_DIR/$MARIADB_LOG_FILE' 2>&1 &",
        "nohup env JAVA_HOME='$JAVA_HOME' java -jar '$REMOTE_PATH/$JAR_FILE_NM' > '$LOG_DIR/$JAVA_LOG_FILE' 2>&1 &"
    )

    foreach ($command in $commands_01) {
        ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" $command
    }

    Write-Host "Restart of the remote server completed successfully."
    
} catch {
    Write-Host "An error occurred: $_"
}