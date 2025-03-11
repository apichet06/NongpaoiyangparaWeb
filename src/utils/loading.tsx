import { Spinner } from "react-bootstrap"

export default function Loading() {
    return (
        <>
            <h1>Loading...</h1>{" "}
            <Spinner className="text-center"
                animation="border"
                variant="secondary"
                style={{ width: '5rem', height: '5rem' }}
            />
        </>

    )
}
