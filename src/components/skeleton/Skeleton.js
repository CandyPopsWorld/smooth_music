import { Skeleton as SkeletonMUI } from "@mui/material";

function Skeleton({variant = 'rectangular', height = 200, width = 200, position = null}) {
    return (
        <SkeletonMUI variant={variant} height={height} width={width} style={{backgroundColor: 'gray', color: 'gray', opacity: '0.3', position: position}} animation='pulse'/>
    );
}

export default Skeleton;