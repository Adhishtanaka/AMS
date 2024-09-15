import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function handleLoginResult(err:string) {
    toast.dismiss();
    toast.error(err, {autoClose: 3000});
}

