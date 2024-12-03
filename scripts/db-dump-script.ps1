# update date : 2024-11-13
# author      : KMJ
# description : 1. JAVA jar 파일 생성
#               2. react build 폴더 생성

Set-ExecutionPolicy Bypass -Scope Process

$LOCAL_SCRIPT_DIR = "LOCAL_SCRIPT_DIR"
$LOCAL_ROOT_DIR = Split-Path -Path $LOCAL_SCRIPT_DIR -Parent
$LOCAL_PATH = Join-Path -Path $LOCAL_ROOT_DIR -ChildPath "backend"
$LOCAL_TARGET_PATH = Join-Path -Path $LOCAL_PATH -ChildPath "target"
$JAR_FILE_NM="JAR_FILE_NM"
$LOCAL_JAR_PATH = Join-Path -Path $LOCAL_TARGET_PATH -ChildPath $JAR_FILE_NM

mvn -f $LOCAL_PATH/pom.xml clean package