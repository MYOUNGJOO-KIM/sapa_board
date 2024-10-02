# [sapa_board]

# {2024-10-02}
# (All Page)
#      1. 블랙 라벨, 화이트 라벨 처리
#      
# 개발 서버 자동 배포 스크립트 작성
#      1. Linux(centOS) 명령어 express
#          - sudo lsof -i :8085
#          - sudo kill [PID]
#          - sudo netstat -tuln | grep 3000
#          - sudo systemctl start mariadb
#          - sudo systemctl status mariadb
#          - sudo 
#      2. ssh 배포 자동화 목표 리스트
#          - FE) 루트폴더의 frontend 에서 react build 있으면 삭제
#          - 루트폴더의 frontend 에서 react build
#          - WEB-INF 폴더 cp
#          - 루트폴더의 frontend의 새로운 build 폴더이름을 ROOT 폴더로 변경 
#          - tomcat ROOT 뒤에 오늘 날짜 붙이고 before 폴더로 mv 
#          - ROOT cp
#          - bin/shutdown.sh
#          - bin/startup.sh
#          - BE) 루트폴더의 backend 에서 packaging
#          - audit-0.0.1-SNAPSHOT.jar cp
#          - java -jar 실행
#
# {2024-09-27}
#
# (Form Page)
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
#    1. 팬, 보드, 쿨러 스크류 꽉 조임
#    2. 먼지 청소
#    3. 아직도 소리남. 팬 교체 필요
#
# 맥북에 프로젝트 폴더 세팅
#    1. java spring boot
#    2. mariaDB
#    3. react.js
#
# {2024-09-26}
# 개발 서버 오류
#
#
# 윈도우 버전 개발 서버 자동 배포 프로그램 생성
#    1. 윈도우 OS와 Linux OS의 공존
#       1) windows 기능 찾기(windows 기능 켜기/끄기)(재부팅)
#       2) powerShell wsl --set-default-version 2 고정
#       3) Linux 배포판 마음에 드는 거 찾아서 설치(Ex. Ubuntu)
#    2. vscode
#       1) .vscode/settings.json에 "terminal.integrated.defaultProfile.windows": "WSL" 추가
#       2) .vscode/tasks.json 생성
#       3) 

# SSH 설정
#    1. SSH 설치 확인
#       ssh -V
#    2. SSH 서비스 시작
#       sudo systemctl start ssh
#       sudo systemctl enable ssh
#    3. 방화벽 설정
#       sudo firewall-cmd --permanent --add-service=ssh  # CentOS/RHEL
#       sudo firewall-cmd --reload  # 방화벽 재시작
#    4. SSH 서버 설정 파일 검토
#       sudo nano /etc/ssh/sshd_config
#    5. SSH 서비스 재시작
#       sudo systemctl restart sshd  # CentOS/RHEL
#    6. 연결 테스트
#       ssh username@server_ip_address
#    4. SSH 키 인증 (선택 사항) 비밀번호 입력 없이 자동으로 연결
#       1) 로컬에서 SSH 키를 생성
#       2) ssh-keygen -t ed25519 (기본적으로 ~/.ssh/id_ed25519 저장됨) id_ed25519: 개인 키 (비밀 키) id_ed25519.pub: 공개 키
#       3) ssh-copy-id username@server_ip_address 서버의 ~/.ssh/authorized_keys에 추가
