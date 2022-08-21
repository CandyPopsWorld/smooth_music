import './Hint.scss';
function Hint({message, top = 0, left = 0, right = 0, bottom = 0}) {
    return (
        <div className="hint" style={{top, left, right, bottom}}>
            <div className="hint_message">{message}</div>
        </div>
    );
}
export default Hint;