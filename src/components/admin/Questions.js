import QuestionService from "../../services/QuestionService";

export default class Questions {
  constructor() {
    this.$container = document.createElement('ul');
    this.state = {
      quesitons: []
    };
    this.init();
  }

  async init() {
    try {
      const res = await QuestionService.fetchQuestions();
      this.state.questions = await res.json();
    } catch (err) {
      console.error(err);
    }
    this.$container.classList.add('questions');
  }

  render() {
    
  }
}
