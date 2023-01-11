import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import "./App.css";
import CalendarComponent from "./Components/CalendarComponent";
import dayjs from "dayjs";
import { meetingType } from "./constants";
import { parseISO, format, isSameDay, startOfToday } from "date-fns";
import cc from "classcat";

const today = dayjs(new Date());
const year = today.year();
const month =
  today.month().toString().length > 1
    ? today.month() + 1
    : `0${today.month() + 1}`;

const meetings = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: `${year}-${month}-11T13:00`,
    endDatetime: `${year}-${month}-11T14:30`,
  },
  {
    id: 2,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: `${year}-${month}-20T09:00`,
    endDatetime: `${year}-${month}-20T11:30`,
  },
  {
    id: 3,
    name: "Dries Vincent",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: `${year}-${month}-20T17:00`,
    endDatetime: `${year}-${month}-20T18:30`,
  },
  {
    id: 4,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: `${year}-${
      today.month().toString().length > 1
        ? today.month() + 2
        : `0${today.month() + 2}`
    }-09T13:00`,
    endDatetime: `${year}-${
      today.month().toString().length > 1
        ? today.month() + 2
        : `0${today.month() + 2}`
    }-09T14:30`,
  },
  {
    id: 5,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: `${year}-${month}-13T14:00`,
    endDatetime: `${year}-${month}-13T14:30`,
  },
];

function App() {
  const [selectedMeetings, setSelectedMeetings] = useState<meetingType[]>(
    meetings.filter((meeting) =>
      isSameDay(parseISO(meeting.startDatetime), startOfToday())
    )
  );
  const [selectedDay, setSelectedDay] = useState<Date>(startOfToday());

  return (
    <div className="App">
      <main>
        <div className="py-10 px-4 md:grid md:grid-cols-2 md:divide-x md:divide-gray-200 max-w-4xl mx-auto">
          <div className="w-full pr-8">
            <CalendarComponent
              meetings={meetings}
              onItemClick={(meetings, day) => {
                console.log("--metings", meetings);
                setSelectedMeetings(meetings);
                setSelectedDay(day);
              }}
            />
          </div>
          <div className="mt-12 md:mt-0 md:pl-8">
            <h2 className="font-semibold text-gray-900">
              Schedule for{" "}
              <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                {format(selectedDay, "MMM dd, yyy")}
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {selectedMeetings.length > 0 ? (
                selectedMeetings.map((meeting) => (
                  <Meeting meeting={meeting} key={meeting.id} />
                ))
              ) : (
                <p>No meetings for today.</p>
              )}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

function Meeting({ meeting }: { meeting: meetingType }) {
  let startDateTime = parseISO(meeting.startDatetime);
  let endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="flex ml-4 items-center px-4 py-2  gap-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-left text-left">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, "h:mm a")}
          </time>{" "}
          -{" "}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, "h:mm a")}
          </time>
        </p>
      </div>

      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100 ml-auto"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={cc([
                      {
                        "bg-gray-100 text-gray-900": active,
                        "text-gray-700": !active,
                      },
                      "block px-4 py-2 text-sm",
                    ])}
                    href="/"
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/"
                    className={cc([
                      {
                        "bg-gray-100 text-gray-900": active,
                        "text-gray-700": !active,
                      },
                      "block px-4 py-2 text-sm",
                    ])}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

export default App;
