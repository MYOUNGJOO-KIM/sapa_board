Set-ExecutionPolicy Bypass -Scope Process

#$LOCAL_SCRIPT_DIR = (Get-Location).Path # 동작 불가
$LOCAL_SCRIPT_DIR = "LOCAL_SCRIPT_DIR"
$LOCAL_ROOT_DIR = Split-Path -Path $LOCAL_SCRIPT_DIR -Parent

$LOCAL_PATH = Join-Path -Path $LOCAL_ROOT_DIR -ChildPath "frontend"
$LOCAL_ETC_PATH = Join-Path -Path $LOCAL_ROOT_DIR -ChildPath "etc"
$LOCAL_WEB_INF_PATH = Join-Path -Path $LOCAL_ETC_PATH -ChildPath "WEB-INF"
$LOCAL_BUILD_PATH = Join-Path -Path $LOCAL_PATH -ChildPath "build"
$LOCAL_CONVERT_PATH = Join-Path -Path $LOCAL_PATH -ChildPath "ROOT"
$FRONT_PORT = "FRONT_PORT"
$REMOTE_USER = "REMOTE_USER" 
$REMOTE_HOST = "REMOTE_HOST"
$REMOTE_PORT = "REMOTE_PORT"

$REMOTE_PATH = "REMOTE_PATH" 

$LOG_DIR = "LOG_DIR"     # 로그 파일 저장 경로
$CURRENT_DATE = (Get-Date).ToString("yyyyMMdd_hhmmss")
$TOMCAT_LOG_FILE = "log_$CURRENT_DATE.log"

$ssh_command = "ssh -p $REMOTE_PORT -o BatchMode=yes -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST exit"

try {
    # SSH 접속 확인
    cmd.exe /c $ssh_command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH connection successful."

        Write-Host "Starting the deployment to the remote server using front_script.sh..."

        # 로컬 해당 위치에 build, root 폴더가 있으면 삭제
        if (Test-Path $LOCAL_BUILD_PATH) {
            Remove-Item -Path $LOCAL_BUILD_PATH -Recurse -Force
        } 

        if (Test-Path $LOCAL_CONVERT_PATH) {
            Remove-Item -Path $LOCAL_CONVERT_PATH -Recurse -Force
        } 

        # react build
        npm --prefix $LOCAL_PATH run build

        # copy WEB-INF
        Copy-Item -Path $LOCAL_WEB_INF_PATH -Destination $LOCAL_BUILD_PATH -Recurse
        Rename-Item -Path $LOCAL_BUILD_PATH -NewName $LOCAL_CONVERT_PATH

        # SSH commands
        $commands_01 = @(
            "$REMOTE_PATH/bin/shutdown.sh",
            "if [ -e '$REMOTE_PATH/webapps/ROOT' ]; then rm -rf '$REMOTE_PATH/webapps/ROOT'; fi"
        )

        $commands_02 = @(
            "$REMOTE_PATH/bin/startup.sh > $LOG_DIR/$TOMCAT_LOG_FILE 2>&1 &"
        )

        $checkDirs = @(
            "checkDirs1",
            "checkDirs2",
            "checkDirs3",
            "checkDirs4"
        )

        foreach ($dir in $checkDirs) {
            ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" "mkdir -p '$dir'"
        }
        foreach ($command in $commands_01) {
            ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" $command
        }

        scp -P $REMOTE_PORT -r "$LOCAL_CONVERT_PATH" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/webapps/ROOT"
            
        foreach ($command in $commands_02) {
            ssh -p $REMOTE_PORT "$REMOTE_USER@$REMOTE_HOST" $command
        }

        Rename-Item -Path $LOCAL_CONVERT_PATH -NewName $LOCAL_BUILD_PATH
        Write-Host "Deployment using back_script.sh to the remote server was successful."
    }
} catch {
    Write-Host "An error occurred: $_"
}
