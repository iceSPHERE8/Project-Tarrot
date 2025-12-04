import HomeScene from "@/scenes/HomeScene/HomeScene";
import SpreadSelector from "@/components/SpreadSelector";

export default function Home(searchParams) {
    const selectedSpread = searchParams.spread || "daily";
    return (
        <>
            <div className="fixed inset-0 bg-[#08060b]">
                <HomeScene selectedSpread={selectedSpread} />
                <SpreadSelector selected={selectedSpread} />
            </div>
        </>
    );
}
