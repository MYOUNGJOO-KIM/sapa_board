# sapa_board
#
# 2024-10-15
#      1. 공용 IP 접근 불가 문제 해결
#         - ssh 접근도 불가하여 Connection timed out 로그
#         - systemctl restart sshd 해봐도 같은 현상이 일어남
#         - 서버 로그 확인을 위해 /etc/ssh/sshd_config 에서 loglevel을 (Default) INFO에서 DEBUG로 변경
#         - LINUX centOS /var/log의 secure을 grep sshd
#         - 오류 관련 내용은 보이지 않아, systemctl restart sshd
#         - ssh 접속이 가능해지고, 기존에 확인 불가능했던 공용 웹페이지도 확인 가능.
#         - 해결된 이유는 아직 찾지 못하여 시스템 리소스 관리가 미흡했다고 판단
#         - 메모리(RAM) 관리 : free -h 로 불필요한 프로세스를 확인 및 종료하거나 메모리를 많이 사용하느나 어플리케이션은 종료 시키기
#         - CPU 사용량 확인 : top 또는 htop 현재 CPU 사용량을 모니터링하여 많이 사용하는 프로세스를 확인 및 종료
#         - 디스크 공간 확인 : df -h 디스크 사용량 확인 및 불필요한 파일이나 로그 파일을 삭제
#         - 프로세스 관리 : ps aux 현재 실행 중인 프로세스를 확인하고, 필요 없는 프로세스를 확인 및 종료
#         - 
#
# 2024-10-14
#      1. catalina.out 지정 위치에 로그 생성 혹은 로그 레벨 올리기 -> startup.sh 수정해야해서 보류
#      2. 블랙 라벨, 화이트 라벨 처리 (SQL 인젝션)
#      3. 조회 조건 '작업자명' 추가
#      4. 증빙자료 관리 조회 추가
#      5. 증빙자료 관리 수정 추가
#      6. 증빙자료 관리 삭제 추가
#      7. Apache JMeter, Gatling, k6와 같은 도구를 사용하여 동시에 접속하는 사용자를 시뮬레이션하고 성능을 테스트.
#      8. 동시성 문제 고려
#
# 2024-10-11
#      1. 누락된 첨부파일 찾아 놓기 -> print_yn flag
#      2. 톰캣 로그 지정 폴더 안 만들어지는 거 확인
#      3. 성능 최적화: 동시에 접속하는 사용자를 고려하는 것이 중요함. 서버와 데이터베이스의 성능을 체크하고, 필요하다면 캐싱 전략이나 로드 밸런싱을 도입하는 것 고려해야 함.
#      4. 보안: 사용자 데이터를 안전하게 보호하기 위한 보안 조치를 마련해야 함. HTTPS 사용, 입력 데이터 검증, 사용자 인증 등을 고려해야 해야 함.
#      5. 모니터링: 배포 후에는 사용자 활동과 시스템 성능을 모니터링할 수 있는 도구를 설정해야 함. 문제가 발생했을 때 빠르게 대응할 수 있도록 하는 것이 중요함.
#      6. 증빙자료 출력 n일 때에는 버튼 누를 때 제외하고 가도록 처리
#      NOTE: Picked up JDK_JAVA_OPTIONS:  --add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.rmi/sun.rmi.transport=ALL-UNNAMED
C:\Windows\System32\OpenSSH\scp.exe: stat local "222": No such file or directory
#
# 2024-10-10
#      1. 증빙자료 출력 > 15개 가져오는 거 10개로 변경
#      2. 증빙자료 출력 > 선택 출력일 때 모두 출력 파라미터 해제
#      3. ssh 포트 정의, 라우터 포트 포워딩 22 -> 222 
#      4. 미리보기 view 추가
#
# 2024-10-04
# 
# 개발 서버 자동 배포 스크립트 작성 (2)
#      1. 윈도우 배포 컴
#          - power shell script 작성
#          
#      
#
# 2024-10-02
# All Page
#      1. 블랙 라벨, 화이트 라벨 처리
#      
# 개발 서버 자동 배포 스크립트 작성 (1)
#      1. Linux(centOS) 명령어 express
#          - sudo lsof -i :{PORT}
#          - sudo kill {PID}
#          - sudo netstat -tuln | grep {PORT}
#          - sudo systemctl start mariadb
#          - sudo systemctl status mariadb
#          - tail -f /{path}/tomcat/logs/catalina.out(실시간)
#          - nohup, screen, tmux
#      2. powerShell 명령어 express
#          - Get-Location 
#            위치 찾기
#
#      3. ssh 배포 자동화 목표 리스트
#          - FE) 루트폴더의 frontend 에서 react build 있으면 삭제
#          - 루트폴더의 frontend 에서 react build
#          - WEB-INF 폴더 cp
#          - 루트폴더의 frontend의 새로운 build 폴더이름을 ROOT 폴더로 변경 
#          - /{path}/tomcat/webapps/ROOT_{yyyyMMdd_hh:mm:ss} 이름 변경 후 before 폴더로 mv 
#          - ROOT cp
#          - /{path}/tomcat/bin/shutdown.sh
#          - /{path}/tomcat/bin/startup.sh
#          - 에러로그 /{path}/tomcat/logs/catalina.out에 찍힌 것 
#            기간 정해서 가져오도록.
#          - BE) 루트폴더의 backend 에서 packaging
#          - {projectNm}.jar cp
#          - java -jar 실행
#          - nohup java -jar {projectNm}.jar > log_{yyyyMMdd_hh:mm:ss}.log 2>&1 &
#          
# 2024-09-27
#
# Form Page
#      2. 첨부파일 첨부 후 treeSelect 하면 관리항목 누락.
#         - Request Header 초기화
#      3. 첨부파일 첨부 후 OCR 불러올 때, 저장할 때 '텍스트를 읽는 중' 문구 추가
#         - useState() 추가
#      4. 증빙자료 출력 화면에서 클릭 시 팝업항목 띄우기, 선택하여 증빙자료 출력 추가하기
#         
#      5. 증빙자료 출력 시 파라미터 인코딩
#         react.js) encodeURIComponent(String) 이용하여 인코딩
#
# 개발 서버 본체 소음
#      1. 팬, 보드, 쿨러 스크류 꽉 조임
#      2. 먼지 청소
#      3. 아직도 소리남. 팬 교체 필요
#
# 맥북에 프로젝트 폴더 세팅
#      1. java spring boot
#      2. mariaDB
#      3. react.js
#
# 2024-09-26
# 개발 서버 오류
#
#
# 윈도우 버전 개발 서버 자동 배포 프로그램 생성
#      1. 윈도우 OS와 Linux OS의 공존
#         1) windows 기능 찾기(windows 기능 켜기/끄기)(재부팅)
#         2) powerShell wsl --set-default-version 2 고정
#         3) Linux 배포판 마음에 드는 거 찾아서 설치(Ex. Ubuntu)
#      2. vscode
#         1) .vscode/settings.json에 "terminal.integrated.defaultProfile.windows": "WSL" 추가
#         2) .vscode/tasks.json 생성
#         3) script파일로 작성하기로 함. extension 폐기.
#
# SSH 설정
#      1. SSH 설치 확인
#         ssh -V
#      2. SSH 서비스 시작
#         sudo systemctl start ssh
#         sudo systemctl enable ssh
#      3. 방화벽 설정
#         sudo firewall-cmd --permanent --add-service=ssh  # CentOS/RHEL
#         sudo firewall-cmd --reload  # 방화벽 재시작
#      4. SSH 서버 설정 파일 검토
#         sudo vi {path}/etc/ssh/sshd_config
#      5. SSH 서비스 재시작
#         sudo systemctl restart sshd  # CentOS/RHEL
#      6. 연결 테스트
#         ssh username@server_ip_address
#      4. SSH 키 인증 (선택 사항) 비밀번호 입력 없이 자동으로 연결
#         1) 로컬에서 SSH 키를 생성
#         2) ssh-keygen -t ed25519 (기본적으로 ~/.ssh/id_ed25519 저장됨) id_ed25519: 개인 키 (비밀 키) id_ed25519.pub: 공개 키
#         3) ssh-copy-id {username}@{server_ip_address} 서버의 ~/.ssh/authorized_keys에 추가
