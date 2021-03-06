import { Component, OnInit } from '@angular/core';
import { QlistService } from './qlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private service: QlistService) { }

  questions: any[];
  qlength: number;
  responses: any[] = [];
  answers: any[] = [];
  tempAns: any[] = [];
  viewMode = 'exam';
  percentage: number;
  current = 0;

  ngOnInit() {
    this.service.get().subscribe(result => {
      //results are shuffled here
      this.questions = this.shuffle(result['results']);
      //this.questions = result['results']
      //only five questions for easier debug
      //this.questions = this.questions.slice(0, 5);
      this.questions.forEach(q => {
        //q.answers = [q.correct_answer].concat(q.incorrect_answers);
        //shuffle answers
        q.answers = this.shuffle([q.correct_answer].concat(q.incorrect_answers));
      })
      this.qlength = this.questions.length;
    });
  }

  //add answer to temporary array
  addAnswer(id: number, ans: string) {
    if (this.tempAns.findIndex(ans => ans.id === id) === -1) {
      this.tempAns.push({
        id: id,
        answer: ans
      })
    }
    else {
      this.tempAns.find(ans => ans.id === id).answer = ans;
    }
    console.log(this.tempAns)
  }

  //add answer to responses array
  submitAnswer(id: number) {
    if ((this.responses.findIndex(ans => ans.id === this.tempAns.find(ans => ans.id === id).id)) === -1) {
      if (this.questions[this.tempAns.find(ans => ans.id === id).id].correct_answer === this.tempAns.find(ans => ans.id === id).answer) {
        this.responses.push({
          id: id,
          answer: this.tempAns.find(ans => ans.id === id).answer,
          res: true
        })
      }
      else {
        this.responses.push({
          id: id,
          answer: this.tempAns.find(ans => ans.id === id).answer,
          res: false
        })
      }
      console.log(this.responses)
    }
    else {
      if (this.questions[this.tempAns.find(ans => ans.id === id).id].correct_answer === this.tempAns.find(ans => ans.id === id).answer) {
        this.responses.find(ans => ans.id === this.tempAns.find(ans => ans.id === id).id).answer = this.tempAns.find(ans => ans.id === id).answer;
        this.responses.find(ans => ans.id === this.tempAns.find(ans => ans.id === id).id).res = true;
      }
      else {
        this.responses.find(ans => ans.id === this.tempAns.find(ans => ans.id === id).id).ans = this.tempAns.find(ans => ans.id === id).answer;
        this.responses.find(ans => ans.id === this.tempAns.find(ans => ans.id === id).id).res = false;
      }
      console.log(this.responses)
    }
  }

  //check whether option is selected
  checkSubmit(id: number) {
    if (this.tempAns.findIndex(ans => ans.id === id) === -1) {
      return false;
    }
    return true;
  }

  //submit all the responses
  submitExam() {
    this.submitAnswer(this.current);
    const correct = this.responses.filter(ans => ans.res === true).length;
    this.percentage = (correct / this.responses.length) * 100;
    this.viewMode = 'summary';
  }

  //get response for a question by id
  getResponse(id: number) {
    return this.responses.find(ans => ans.id === id);
  }

  //shuffle array elements
  shuffle(array: any[]) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  //get questions by current value
  getQuestion() {
    return this.questions[this.current];
  }

  //get the next question
  nextQuestion() {
    this.submitAnswer(this.current);
    this.current += 1;
    console.log(this.qlength, this.current)
  }

  //ge the prev question
  prevQuestion() {
    this.current -= 1;
  }

  //is prev question possible
  isPrev() {
    if(this.current > 0) {
      return true;
    }
    return false;
  }

  //is next question possible
  isNext() {
    if(this.current == this.qlength - 1) {
      return false;
    }
    return true;
  }

}

