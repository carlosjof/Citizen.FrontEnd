import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";


export default function useFetch(url: string){

    const TOKEN = useAuthStore((state) => state.token);

    const [data, setData] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    

    useEffect(() => {
        setLoading(true)

        fetch(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }})
        .then((response) => response.json())
        .then((data) => {
            setData(data.data)
            setHasNext(data.hasNext)
            setHasPrevious(data.hasPrevious)
        })
        .catch((error) => {
            setError(error)
            console.log(error)
            toast.error("An error occurred while loading the data");
        })
        .finally(() => setLoading(false))
    }, [url])

    
    return {data, hasNext, hasPrevious, loading, error}
}