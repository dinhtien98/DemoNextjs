import { Subject } from 'rxjs';

const loginSubject = new Subject<{ param: number }>();

export const loginService = {
    triggerLogin: (param: number) => loginSubject.next({ param }),
    onLogin: () => loginSubject.asObservable(),
};
