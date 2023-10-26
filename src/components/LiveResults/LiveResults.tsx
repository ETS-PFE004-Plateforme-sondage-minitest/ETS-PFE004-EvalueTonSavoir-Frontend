import {Socket} from 'socket.io-client';


interface LiveResultsProps {
    socket: Socket | null;
}
const LiveResults : React.FC<LiveResultsProps> = ({socket}) => {
    return (
        <div>
            Allo
        </div>
    );
}

export default LiveResults;