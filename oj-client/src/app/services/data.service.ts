import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _problemSource = new BehaviorSubject<Problem[]>([]) ;
  constructor(private httpClient: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.httpClient.get('api/v1/problems')
      .toPromise()
      .then((res: any) => {
        console.log(res);
        this._problemSource.next(res);
      })
      // .catch((err: HttpErrorResponse) => {
      //   // simple logging, but you can do a lot more, see below
      //   console.error('An error occurred:', err.error);
      // });
      .catch(this.handleError);

      return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
  	return this.httpClient.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res:any) => res)
      .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    const options = { headers: new HttpHeaders( { 'Content-Type': 'application/json'})};
    return this.httpClient.post('api/v1/problems', problem, options)
      .toPromise()
      .then((res:any) => {
        this.getProblems();
        return res;
      })
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
