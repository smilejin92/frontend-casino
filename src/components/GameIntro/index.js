import './style.scss';

export default class GameIntro {
  constructor({ text, store }) {
    this.text = text;
    this.store = store;
    this.gameIntro = document.createElement('section');
    this.init();
  }

  init() {
    this.gameIntro.classList.add('game-intro');
  }

  render() {
    this.gameIntro.innerHTML = `
      <h3 class="intro-title">Frontend Casino에 오신 것을 환영합니다.</h3>
      <p class="rule-title">게임의 룰은 아래와 같습니다.</p>
      <ul class="rules">
        <li class="rule">
          Basic
          <ul class="sub-rules">
            <li class="sub-rule">앱 실행시 최초 10000P를 지급합니다.</li>
            <li class="sub-rule">보유 포인트만큼 퀴즈를 플레이 할 수 있습니다.</li>
            <li class="sub-rule">퀴즈를 풀면 해당 퀴즈의 포인트만큼 보유 포인트가 증가합니다.</li>
            <li class="sub-rule">퀴즈를 풀지 못하면 해당 퀴즈의 포인트만큼 보유 포인트가 차감됩니다.</li>
            <li class="sub-rule">보유 포인트가 0일 경우 리셋 버튼이 표시됩니다. 리셋 버튼을 클릭하면 보유 포인트와 퀴즈가 초기화됩니다.</li>
          </ul>
        </li>
        <li class="rule">
          Double Down이란?
          <ul class="sub-rules">
            <li class="sub-rule">퀴즈를 풀지 못할 경우 Double Down 할 수 있습니다.</li>
            <li class="sub-rule">플레이한 퀴즈(ex. HTML/5000P)를 풀지 못하면 같은 조건의 문제(ex. HTML/5000P)를 다시 플레이 할 수 있습니다.</li>
            <li class="sub-rule">위 예제의 경우 Double Down에 성공하면 총 10000P를 획득하고, 실패 할 경우 10000P가 차감됩니다.</li>
            <li class="sub-rule">Double Down 기능은 남은 보유 포인트와 퀴즈의 상태에 따라 표시되지 않을 수 있습니다.</li>
            <li class="sub-rule">Double Down 기회는 하나의 퀴즈에 단 한번 뿐이므로 신중하게 사용하세요!</li>
          </ul>
        </li>
        <li class="rule">
          명예의 전당
          <ul class="sub-rules">
            <li class="sub-rule">모든 문제를 풀었을 경우 명예의 전당에 이름을 등록 할 수 있습니다</li>
            <li class="sub-rule">등록 이후 보유 포인트와 퀴즈가 초기화됩니다.</li>
          </ul>
        </li>
      </ul>
    `;

    return this.gameIntro;
  }
}
