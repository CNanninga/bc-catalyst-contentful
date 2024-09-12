'use client';

import { CSSProperties, forwardRef, ReactNode, Ref, useState } from 'react';
import clsx from 'clsx';

interface Member {
  name?: string
  position?: string
  image?: string
  content: ReactNode
}

interface Props {
  className?: string
  members: Member[]
  highlightColor?: string
  thumbnailTextColor?: string
  thumbnailOrientation?: "vertical" | "horizontal"
  itemsPerRow?: number
}

export const TeamMembers = forwardRef((
  { 
    className,
    members,
    highlightColor,
    thumbnailTextColor,
    thumbnailOrientation,
    itemsPerRow = 3,
  }: Props, 
  ref: Ref<HTMLDivElement>
) => {
  const vertical = (thumbnailOrientation === "vertical");
  const fadeInDuration = 500;
  const [activeMember, setActiveMember] = useState(0);
  const [visibleMembers, setVisibleMembers] = useState([0]);

  const changeActiveMember = (index:number) => {
    const prevActiveIndex = activeMember;

    const newVisibleMembers = [...visibleMembers, index];

    setVisibleMembers(newVisibleMembers);

    setTimeout(() => {
      setActiveMember(index);

      setTimeout(() => {
        setVisibleMembers(newVisibleMembers.filter(thisIndex => thisIndex !== prevActiveIndex));
      }, fadeInDuration * 1.5);
    }, 10);
  };

  return (
    <div
      className={clsx(
        className,
        "w-full",
        vertical && "flex gap-4"
      )}
      ref={ref}
    >
      {(members.length > 0) ?

      <>
      <div 
        className={clsx(
          vertical && "flex-none",
          vertical || "p-4"
        )}
      >
        <ul 
          className={clsx(
            vertical || "grid gap-x-4 gap-y-8 md:px-16 justify-items-center",
            vertical || "grid-cols-[var(--itemsPerRow)]"
          )}
          //eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          style={{ 
            "--itemsPerRow": `repeat(${itemsPerRow}, minmax(0, 1fr))`,
          } as CSSProperties}
        >
          {members.map((member, index) => (

            //eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
            <li 
              className={clsx(
                `max-w-24 sm:max-w-48 text-center border border-2 p-2 
                rounded-md cursor-pointer transition-colors duration-300`,
                "text-[var(--textColor)]",
                index === activeMember ? "border-[var(--highlightColor)]" : "border-transparent"
              )} 
              key={index} onClick={() => changeActiveMember(index)}
              //eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              style={{ 
                "--highlightColor": highlightColor,
                "--textColor": thumbnailTextColor,
              } as CSSProperties}
            >
              <img className="rounded-full mx-auto max-w-[60%]" src={member.image} alt={member.name} />
              <h3 className="text-sm font-bold">
                {member.name}
              </h3>
              <p className="text-sm">
                {member.position}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className={clsx(
        "relative overflow-hidden",
        vertical && "flex-auto min-h-[560px]",
        vertical || "relative h-[560px]"
        )}>
        {members.map((member, index) => {
          if (!visibleMembers.includes(index)) return null

          return (
            <div  
              className={clsx(
                "absolute transition-opacity duration-[var(--fadeDuration)] w-full",
                (index !== activeMember) ? "opacity-0" : "opacity-100"
              )}
              key={index}
              //eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              style={{
                "--fadeDuration": `${fadeInDuration}ms`,
              } as CSSProperties}
            >
              {member.content}
            </div>
          )
        })}
      </div>
      </>

      : 

      <div className="w-full"><h3 className="text-lg text-center">Add a Team Member</h3></div>

      }
    </div>
  );
});

export default TeamMembers;
