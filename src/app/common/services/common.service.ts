import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class CommonService {
    constructor(private ToastController: ToastController) { }

    public createToast = async ({ message, duration: durationSeconds, color }: { message: string, duration: number, color: string }): Promise<void> => {
        const finalDuration = (durationSeconds || 4) * 1000;
        const toast = await this.ToastController.create({
            message,
            duration: finalDuration,
            color,
        });
        await toast.present();
    }
}