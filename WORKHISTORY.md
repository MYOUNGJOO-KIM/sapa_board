# sapa_board
#
# 2024-12-19
#      1. save, insert 로직 수정
#      2. formState 수정
#      3. 
#
# 2024-12-16
#      1. react status 분리
#
# 2024-12-09 ~ 2024-12-13 준공
#
# 2024-12-09
#      1. tree update 수정
#      2. inputSet, clear 전체적으로 form에 맞추기
#      3. category RUD시 rowclick이 있었을 때 초기화 단위를 rowclick 전단계로 변경
#      4. 개발컴, 로컬 중앙집중형 형상 관리 시스템 형상관리 툴 생성(keep)
#      5. 문의쪽 DB 설계 시작
#
# 2024-12-06
#      1. tree update 수정
#      2. inputSet, clear 전체적으로 form에 맞추기
#      3. category RUD시 rowclick이 있었을 때 초기화 단위를 rowclick 전단계로 변경
#      4. 개발컴, 로컬 중앙집중형 형상 관리 시스템 형상관리 툴 생성(keep)
#      5. 문의쪽 DB 설계 시작
#      6. centOS 7 root, 사용자 비밀번호 변경
#
# 2024-12-04
#      1. 운영 반영 시 od 컬럼 추가
#      2. 트리에다가 od 추가에서 문제 생김.
#         - update 데이터 반영 불가
#         - react status 업데이트까지는 확인. 이후 업데이트 데이터 확인 불가. 
#
# 2024-12-03
#           문제 발생 : rc-tree 관리 부분이 없어서 unique key 값으로 정렬해서 쓰고 있었으나, 트리 순서 변경이 필요해졌다.
#         해결 방안 1 : 전체 데이터에 대한 od를 추가한다
#                        다른 문제 발생 : 트리 depth의 변동에 따라 모든 데이터의 od를 바꿔야 하는 문제 발생을 야기함.
#         해결 방안 2 : 같은 부모의 같은 depth의 자식들에 대한 od를 준다.
#                        -> 아직 안해봄
#
# 2024-11-28
#      월급날(매달 말일)이다. 
#      전체 회의가 소집되었다.
#      사정이 좋지 않아 월급을 줄 수 없다고 하신다.
#      아무도 월급을 받지 못했다.
#
# 2024-11-27
#      1. react-js-pagination activePage 조사 및 커스텀 -> 다른 수정 사항 적용 후로 미룸
#      2. react-dropzone 첨부파일 개별 삭제 기능 추가 및 리스트 업을 SUM 방식으로 변경
#      3. 게시판 리스트 선택 상태일 때 검색창 비활성화
#
# 2024-11-25
#      1. Java Spring boot RuntimeException 등 예외 발생 시, 기본적으로 HTTP 응답으로는 500 Internal Server Error 상태 코드만 반환되고, 예외 메시지는 응답 본문에 포함되지 않도록 설정되어 있음에 따른 undefined 표시.(요청or리액션 타임 언발란스 X)
#      2. 우선은 server.error.include-message=always 설정으로 예외 메세지도 응답 본문에 포함시키도록 함.
#      3. 추후 GlobalExceptionHandler 로 핸들링 할 것임.
#
# 2024-11-14 ~ 2024-11-22 준공일 대비 외근
#
# 2024-11-13
#      1. 개발서버 root 폴더 폴더링
#      2. 유저 테스트 수정사항 반영
#      3. 서버 자동 재시작 
#      4. 코드 최적화
#      5. 개발서버 비밀번호 주기적 변경
#
# 2024-11-12
#      1. 개발서버 DB 자동 백업 시스템 설계
#
# 2024-11-11
#      1. 개발서버 404오류(해결 못함)
#      2. 메뉴얼 만들기
#
# 2024-11-08
#      1. 현장 자료 정리
#      2. 고객대응 게시판 UI 설계 수정
#
# 2024-11-07
#      1. 현장 지원 (비콘 설치)
#
# 2024-11-06
#      1. 현장 지원 (비콘 설치)
#
# 2024-11-05
#      1. 개발서버 복구 완료
#         - 여유 공간 부족. 기존에 돌아가던 다른 서비스를 처리해야 함.
#         - DB 테스트 데이터 및 로그 삭제.
#
# 2024-11-01 ~ 2024-11-04 휴가
#
#
# 2024-10-31
#      1. 통신사 미납으로 네트워크 망 정지로 인한 급 운영 현장 방문 및 서버 복구 시도
#         - 납품 받은 서비스는 정상 작동을 확인함.
#         - https(443), 서비스 포트 모두 접속 불가함.
#         - Docker Container은 Restart 하였을 때 로그 잘 찍힘.
#         - 시스템 로그 확인 시 에러 문구 관련 로그 찍힘.
#         - 네트워크 포트포워딩 문제인지, 서비스의 문제인지 명확히 확인이 어려움.
#         - 공유기 설정에 들어가 봤을 때, 인수인계 받은 비밀번호가 없어 로그인이 불가함. 
#         -> 라우터를 공장 기본 설정으로 재설정하여 기본 비밀번호로 접속하여 포트포워딩을 확인하는 것이 남은 방법이었으나, 
#            다른 현장에서 해당 사이트로 교육이 진행중이었으므로 납품업체와 함께 확인하고자 미팅  일자만 잡고 복귀함.
#
# 2024-10-30
#      1. 유저 테스트 진행중(실시간 로그 확인 및 대응)
#      2. 문의 대응 게시판 화면 정의 완
#      3. 유저 테스트 완료 후 개발 서버 메모리 부족으로 서버의 서빙 정지. 
#      
# 2024-10-28
#      1. Last failed login: Mon Oct 28 08:22:09 KST 2024 from 000.00.000.00 on ssh:notty
There were 1657 failed login attempts since the last successful login.
#         - 보안 강화 필요 : fail2ban 로 로그인 실패 반복하는 IP를 차단
#         - fail2ban-client status
#         - sudo fail2ban-client status sshd | grep 'Banned IP list'
# 2024-10-25
#      1. 카테고리 테이블 정리 도중, upCatCd의 중복 확인이 필요함을 확인(삭제된 카테고리 값들 대혼란)
#      2. 변리사 선핸문헌 확인(특별한 기술의 추가가 아니고서야 기존 소프트웨어로는 특허용의 차별성이 없음)
#
# 2024-10-24
#      1. 유저 테스터 서류(계약서, 정보보호서약서) 및 가이드 준비
#      2. 테스트 환경 세팅(userId->쿠키 저장->로그 표시)
#      
# 2024-10-23
#      1. 리눅스에서 tomcat 권한
#         - bin 하위 폴더나 프로그램들은 실행하는 스크립트들이 많으므로, 거의 다 권한이 소유자로 박혀 있음.
#             root로 접속해서 ACL을 통한 권한 추가해주면 쉽게 해결. setfacl -R -m u:사용자:rx apache-tomcat-10.0.6/
#         - 톰캣 로그를 작성하는 catarina 쪽의 권한은 읽기, 실행, 작성 이 필요함.
#             ACL을 통한 권한 추가 : setfacl -m u:사용자명:rwx /opt/apache-tomcat-10.0.6/logs
#      2. mariaDB 운영 DB 버전으로 변경
#         - mariaDB 11.4 삭제 
#
# 2024-10-22
#      1. DB 자동 백업 스크립트 필요
#         - 백업을 정기적으로 수행하기 위해 크론 작업(cron job)을 설정
#         - 0 2 * * * /path/to/backup_script.sh
#         - 백업 파일의 버전을 관리하고, 
#           주기적으로 백업이 제대로 이루어지는지 테스트하여 복구 가능성을 확인
#         - DBMS의 실행 중 발생할 수 있는 문제 : 
#           운영체제 오류, 전원 차단, 파일 시스템 오류, 하드웨어 오동작
#         - 하드웨어 및 소프트웨어의 오류 이외에 사용자의 실수, 
#           보안 공격 등의 문제가 발생할 수 있음
#         - 사고 발생 이전 시점으로 데이터를 복원 하기 위한 복제된 데이터를 마련
#         - 데이터와 트랜잭션에 수행되는 작업에 대한 모든 내용을 
#           주기적으로 저장해두는 작업, 백업 방법 및 백업 주기 등의 
#           백업 정책을 결정하고 백업 데이터를 별도의 저장장치에 관리하는 작업
#         - https://www.itworld.co.kr/news/223099 참고
#         - ssh -L 3307:localhost:3306 user@remote_host -N &
#           mysqldump -h 127.0.0.1 -P 3307 -u username -p database_name > backup.sql
#      2. 고객 의견 넣는 관리 홈페이지 필요
#
#
# 2024-10-21
#      3. 어플리케이션 트리 위치 지정 필요
#      4. 블랙 라벨, 화이트 라벨 처리 (SQL 인젝션) -추후
#      5. 조회 조건 '작업자명' 추가 -추후
#      6. 증빙자료 관리 조회 추가 -추후
#      7. 증빙자료 관리 수정 추가 -추후
#      8. 증빙자료 관리 삭제 추가 -추후
#      9. Apache JMeter, Gatling, k6와 같은 도구를 사용하여 동시에 접속하는 사용자를 시뮬레이션하고 성능을 테스트.
#      10. 동시성 문제 고려
#      11. 특허 출원 준비 : 출원인코드 발급, 출원 서류, 특허명세서(변리사통해), 심사청구서 필요. 
#           - 첫 번째 절차, 선행기술조사(변리사 필요)
#           - 두 번째 절차, 특허출원 시 필요한 서류를 작성하여 제출
#                           특허출원서(출원, 대리인(변리사), 발명자 정보), 
#                           명세서(발명의 명칭, 기술분야, 발명의 배경이 되는 기술, 발명의 내용)
#                           요약서, 도면 등
#                           특허 출원료 납부
#             두 번째 절차, 심사청구
#             세 번째 절차, 특허심사
#             네 번째 절차, 심사착수중간사건 대응
#             다섯 번째 절차, 특허결정의 순서로 절차 진행
#             여섯 번째 절차, 의견제출통지서
#                             특허 신청 후 약 1년 내에 의견제출통지서 통지받음. 
#                             대부분 진보성 위반으로 통지. 
#                             특허 출원인은 의견서와 보정서를 제출하여 심사관에게 
#                             선행기술과 본 발명과의 차이점을 주장하게 됨. 
#                             특허법은 특허청구범위의 보정 범위를 제한하고 있고, 
#                             출원인이 의견서와 보정서를 작성하여 심사관을 설득하는 것은
#                             매우 어려울 수 있으므로 전문가의 도움이 필요. 
#                             심사관 설득을 완료하면 특허등록결정서가 통지됨. 
#                             통지받은 날로부터 3월 이내에 설정등록료를 납부해야 
#                             특허권 획득 가능. 
#                             이때 3년치의 특허유지료를 한 번에 납부. 
#                             4년차부턴 매년 등록유지료를 납부해야 함.
#      12. 유저 테스트 메뉴얼 작성
#      13. 세션 붙일 준비
#
# 2024-10-18
#      1. 리눅스 서버 시스템 리소스 관리
#         - 메모리(RAM) 관리(free -h) : total - 15G / used - 7.0G(before 7.0G) / available - 7.7G(before 7.8G) (양호)
#         - CPU 사용량 확인(top/htop) : tasks - 167, 741 / 쓸모없는 프로세스 9.4% - 38개 / 7.9% - 38개 / 7.6% - 38개 삭제 필요 
#         - 디스크 공간 확인(df -h) : 시스템의 루트 파일 시스템이 크기: 50G, 사용량: 30G, 
#                                     여유: 21G, 사용 비율: 59% 이므로 지속적 관리가 필요함. 
#                                     60% 안 넘는게 좋음
#         - 프로세스 관리(ps aux/ps aux --sort=-%mem) : 위에 CPU 사용중인 놈들과 동일하게 삭제 필요
#      2. 원격 관리 툴 추가할 것
#         - 모니터링: 서버 상태 및 서비스 모니터링 도구를 설정하세요. 
#                     예를 들어, Prometheus, Grafana, Zabbix 등을 사용할 수 있습니다. 
#                     이를 통해 서버의 CPU, 메모리, 디스크 사용량 등을 실시간으로 확인할 수 있습니다.
#         - 로그 관리: 로그 파일을 중앙에서 관리하고 분석할 수 있는 시스템을 설정하세요. 
#                      ELK(Elasticsearch, Logstash, Kibana) 스택이나 Fluentd 등을 활용할 수 있습니다. 
#                      이를 통해 문제가 발생했을 때 원인을 신속히 파악할 수 있습니다.
#         - 자동 백업: 데이터와 서버 설정의 자동 백업을 설정하세요. 
#                      스크립트나 도구를 사용하여 정기적으로 백업을 수행하고, 백업 파일을 안전한 장소에 저장하는 것이 좋습니다.
#         - 알림 시스템: 서버에 문제가 발생할 경우 알림을 받을 수 있는 시스템을 설정하세요. 
#                      Slack, 이메일, SMS 등을 통해 즉시 통지받을 수 있습니다.
#         - 서비스 장애 복구: 서비스가 중단될 경우 자동으로 재시작하도록 설정하는 방법을 고려해보세요. 
#                      systemd의 유닛 파일을 사용하여 서비스를 관리할 수 있습니다.
#         - 보안 강화: SSH 접속 시 공개키 인증을 사용하고, 불필요한 포트를 닫으며 방화벽을 설정하세요. 
#                      Fail2Ban과 같은 도구를 사용하여 악의적인 접근을 차단할 수도 있습니다.
#       3. 세션 관리
#
#
# 2024-10-16
#      1. 리눅스 서버 시스템 리소스 관리
#         - 메모리(RAM) 관리(free -h) : total - 15G / used - 7.0G(before 6.8G) / available - 7.8G(before 8.0G) (양호)
#         - CPU 사용량 확인(top/htop) : tasks - 163, 706 / 쓸모없는 프로세스 9.4% - 38개 / 7.9% - 38개 / 7.6% - 38개 삭제 필요 
#         - 디스크 공간 확인(df -h) : 시스템의 루트 파일 시스템이 크기: 50G, 사용량: 30G, 
#                                     여유: 21G, 사용 비율: 59% 이므로 지속적 관리가 필요함. 
#                                     60% 안 넘는게 좋음
#         - 프로세스 관리(ps aux/ps aux --sort=-%mem) : 위에 CPU 사용중인 놈들과 동일하게 삭제 필요
#      2. 서버 컴퓨터 자동 시작 스크립트
#         - 컴 재기동 시 서비스 시작하는 스크립트 작성(sshd restart 포함)
#         - 원격으로 서비스 중지&시작하는 스크립트 작성
#         - 기존 pnt 자동 시작 쉘 중지시키기
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
#         - 메모리 확인해보면 현재 사용중인 프로세스들이 각 어느정도 자리차지 하는지를 알 수 있다.
#           이미지 등의 정적 파일들은 SSD(하드디스크 등)에 저장됨. 존재 자체로는 메모리를 차지하지 않음.
#           이미지를 확인할 때 뷰어 프로그램등의 프로세스가 추가 메모리로 얹혀지고
#           그 프로세스가 이미지를 참조하여 보여지거나 재생되어야 하므로 필요한 공간만큼 자동 할당
#           일부 프로그램은 성능을 높이기 위해 파일을 메모리에 캐시하여 반복적으로 접근할 때 속도를 향상시킴
#           그러나 그렇게되면 정적 자원들은 메모리에 자리차지를 언제나 해야하므로 컴퓨터 측면에서 봤을 땐
#           미움.
#           정적 파일이 메모리를 차지하는 크기는 거의 동일함. 예를 들어
#           5MB의 이미지를 뷰어로 본다면 대략 5MB의 메모리가 사용됨.
#           (뷰어 프로세스의 추가 메모리를 제외하면)
#         - 파일 시스템 : 운영 체제가 데이터를 저장하고 관리하는 방식을 정의한 구조. 
#                         디스크에 데이터 저장, 데이터 구조화 결정, 파일 관리(CRUD 등), 
#                         디렉터리 구조 관리, 접근 권한 관리 등을 함
#                         windows - NTFS, USB드라이브 - FAT32 ... , Linux - ext4, macOS - HFS+
#
#                         devtmpfs : Linux의 장치 파일(디바이스 파일)을 관리하는 파일 시스템
#                         tmpfs : 임시 파일을 저장하기 위한 파일 시스템. 시스템 재부팅 시 사라짐.
#                         devtmpfs, tmpfs 얘네는 특수한 파일 시스템으로 일반적인 디스크 저장 공간이 아니라
#                         메모리를 기반으로 하거나 시스템의 디바이스 파일을 관리함. 총 용량도 동적으로 받음.
#                         내꺼가ㅏ 16기가 램이고, 1기가는 빼고, 프로세스가 실제 사용중인 용량이 거의 7기가,
#                         새로운 프로세스가 사용가능한 용량이 8.0G라고 나올 때
#                         (free -h 의 free + shared + buff/cache = available)
#                         파일 시스템에서 동적으로 최대 저장크기를 유추할 때 7.7기가인거임.
#         - CPU 사용량 확인 : top 또는 htop 현재 CPU 사용량을 모니터링하여 많이 사용하는 프로세스를 확인 및 종료
#         - 디스크 공간 확인 : df -h 디스크 사용량 확인 및 불필요한 파일이나 로그 파일을 삭제
#         - 프로세스 관리 : ps aux 현재 실행 중인 프로세스를 확인하고, 필요 없는 프로세스를 확인 및 종료
#      2. 리눅스 서버 시스템 리소스 관리
#         - 메모리(RAM) 관리(free -h) : total - 15G / used - 6.8G / available - 8.0G (양호)
#         - CPU 사용량 확인(top/htop) : tasks - 163, 706 / 쓸모없는 프로세스 9.4% - 38개 / 7.9% - 38개 / 7.6% - 38개 삭제 필요
#         - 디스크 공간 확인(df -h) : 시스템의 루트 파일 시스템이 크기: 50G, 사용량: 30G, 
#                                     여유: 21G, 사용 비율: 59% 이므로 지속적 관리가 필요함. 
#                                     60% 안 넘는게 좋음
#         - 프로세스 관리(ps aux/ps aux --sort=-%mem) : 위에 CPU 사용중인 놈들과 동일하게 삭제 필요
#
# 2024-10-14
#      1. catalina.out 지정 위치에 로그 생성 혹은 로그 레벨 올리기 -> startup.sh 수정해야해서 보류
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
#      1. SQL Injection 블랙 라벨, 화이트 라벨 처리
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
