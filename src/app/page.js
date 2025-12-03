import HomeScene from "@/scenes/HomeScene/HomeScene";
import SpreadSelector from "@/components/SpreadSelector";

export default function Home( searchParams ) {
    const selectedSpread = searchParams.spread || "daily";
    return (
        <>
            <HomeScene selectedSpread={selectedSpread} />
            <SpreadSelector selected={selectedSpread} />
        </>
    );
}
