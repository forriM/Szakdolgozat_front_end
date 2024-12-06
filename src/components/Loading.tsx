import { CircularProgress } from "@mui/material"

export const Loading: React.FC = () => {
    return (
        <div className="loadingcontainer">
            <div><CircularProgress /></div>
            <h3>Loading...</h3>
        </div>

    )
}