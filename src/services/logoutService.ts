import { Subject } from 'rxjs';

const logoutSubject = new Subject<{ param: string }>();

export const logoutService = {
    triggerLogout: (param: string) => logoutSubject.next({ param }),
    onLogout: () => logoutSubject.asObservable(),
};
