import { Skeleton as SkeletonMUI } from "@mui/material";
function Skeleton({variant = 'rectangular', height = 200, width = 200, position = null, margin = null, top = null}) {
    return (
        <SkeletonMUI variant={variant} height={`${height}px`} width={ `${width}px`} style={{top,backgroundColor: 'gray', color: 'gray', opacity: '0.3', position: position, margin}} animation='pulse'/>
    );
}
export default Skeleton;