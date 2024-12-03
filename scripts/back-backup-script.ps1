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

$REMOTE_PATH="REPOTE_PATH"
$JAR_FILE_NM="JAR_FILE_NM"
$LOCAL_JAR_PATH = Join-Path -Path $LOCAL_TARGET_PATH -ChildPath $JAR_FILE_NM

$JAR_BACKUP_DIR = "JAR_BACKUP_DIR"     # 로그 파일 저장 경로
$MARIADB_BACKUP_DIR = "MARIADB_BACKUP_DIR"
$CURRENT_DATE = (Get-Date).ToString("yyyyMMdd_HHmmss")
$JAR_BACKUP_FILE_NM="JAR_BACKUP_FILE_NM"
$MARIADB_BACKUP_FILE_NM="MARIADB_BACKUP_FILE_NM"

$ssh_command = "ssh -p $REMOTE_PORT -o BatchMode=yes -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST exit"

try {
    # SSH 접속 확인
    cmd.exe /c $ssh_command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH connection successful."

        Write-Host "Starting the back-backup-script.ps1..."

        # SSH commands
        $commands_01 = @(
            "mysqldump -u root -pjoyandrising hsc > $MARIADB_BACKUP_DIR/$MARIADB_BACKUP_FILE_NM",
            "cp $REMOTE_PATH/$JAR_FILE_NM $JAR_BACKUP_DIR/$JAR_BACKUP_FILE_NM"
        )

        $checkDirs = @(
            "checkDirs1",
            "checkDirs2",
            "checkDirs3",
            "checkDirs4",
            "checkDirs5"
        )

        foreach ($dir in $checkDirs) {
            ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" "mkdir -p '$dir'"
        }
        foreach ($command in $commands_01) {
            ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" $command
        }

        Write-Host "- end -"
    }
} catch {
    Write-Host "An error occurred: $_"
}
