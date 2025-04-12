import Loading from "../../components/Loader";
import { supabase } from "../../supabase";
import { useEffect, useState } from "react";
import Image from "../../components/Image";
import { getRelativeTimeString } from "../../utils/relativeTime";

type PartyUpdate = {
  resource_id: string;
  title: string;
  images_url: string;
  created_at: string;
  sub_title: string;
  resource_url: string;
  author: string;
};
export default function PartyUpdates() {
  const [isLoading, setIsLoading] = useState(true);
  const [updateData, setUpdateData] = useState<PartyUpdate[]>([]);

  useEffect(() => {
    getUpdates();
  }, []);

  async function getUpdates() {
    const { data, error } = await supabase
      .from("resources")
      .select(
        "resource_id, title, images_url, created_at, sub_title, author, resource_url"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setUpdateData(data);
    setIsLoading(false);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 w-full dark:text-text-dark">
      <h2 className="text-2xl ">Resources for you</h2>
      <div className="grid grid-cols-fluid gap-4">
        {updateData.map((party) => (
          <a
            key={party.resource_id}
            className=" hover:scale-95 duration-300 overflow-hidden bg-white dark:bg-background-light/10 rounded-xl w-full flex-col flex gap-2  shadow-lg h-[300px]"
            href={party.resource_url}
            target="_blank"
          >
            <figure>
              <Image
                src={party?.images_url || '/nigeria.png'}
                alt="update"
                bucketName="update_pictures"
                fallbackSrc="/nigeria.png"
                className="h-[200px] object-cover"
              />
            </figure>
            <div className="p-2 flex flex-col">
              <h3 className="text-xl font-medium">{party?.title}</h3>
              <p className=" max-w-[200px] md:max-w-[500px] overflow-hidden whitespace-nowrap text-ellipsis opacity-90 text-sm mb-2">
                {party?.sub_title}
              </p>
              <p className="text-xs opacity-60">
                {getRelativeTimeString(party?.created_at)}
              </p>
            </div>
          </a>
        ))}
        {updateData.length === 0 && (
          <p className=" opacity-50">No updates available</p>
        )}
      </div>
    </div>
  );
}
