import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function handleErrorResult(err:string) {
    toast.dismiss();
    toast.error(err, {autoClose: 3000});
}

export function handleSuccessResult(err:string) {
    toast.dismiss();
    toast.success(err, {autoClose: 3000});
}

