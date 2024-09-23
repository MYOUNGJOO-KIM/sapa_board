# sapa_board

# [2024-09-23]
# {All Page}
#      1. 블랙 라벨, 화이트 라벨 처리
# {Form Page}
#      1. 첨부파일 첨부 후 treeSelect 하면 관리항목 누락.
#      2. 첨부파일 첨부 후 OCR 불러올 때, 저장할 때 '텍스트를 읽는 중' 문구 추가
#      3. 증빙자료 출력 화면에서 클릭 시 팝업항목 띄우기, 선택하여 증빙자료 출력 추가하기
#      4. 증빙자료 출력 시 파라미터 인코딩
#         react.js) encodeURIComponent(String) 이용하여 인코딩
#         java spring boot) @RequestParam 로 받고
#                           URLDecoder.decode()로 디코딩
#                           ObjectMapper 생성하여 JSON 파싱
#                           파라미터 호환 클래스로 Mapping
