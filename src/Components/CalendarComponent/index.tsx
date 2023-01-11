import { ReactComponent as IconArrow } from "../../assets/icons/arrow-payment.svg";
import {
  format,
  parse,
  startOfToday,
  eachDayOfInterval,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  isToday,
  isSameMonth,
  isEqual,
  add,
  isSameDay,
  parseISO,
} from "date-fns";
import React, { Fragment, useState } from "react";
import cc from "classcat";
import dayjs from "dayjs";
import { meetingType } from "../../constants";

type Props = {
  meetings: any[];
  onItemClick?: (meetings: meetingType[], selectedDay: Date) => void;
};

function CalendarComponent({ meetings, onItemClick }: Props) {
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const previousMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  return (
    <div className="">
      <div className="max-w-md p-4 mx-auto sm:px-7 md:max-w-4xl md:px-6 bg-white rounded-md border border-gray-400">
        <div className="">
          <div className="">
            <div className="flex items-center">
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 bg-gray-100 rounded-full"
              >
                <IconArrow className="w-2 transform fill-gray-600 rotate-180" />
              </button>
              <h2 className="text-center font-semibold text-gray-900 mx-auto">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 bg-gray-100 rounded-full"
              >
                <IconArrow className="w-2 transform fill-gray-600 " />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-4 text-xs leading-6 text-center text-gray-800 font-semibold">
              <div>Su</div>
              <div>Mo</div>
              <div>TU</div>
              <div>WE</div>
              <div>TH</div>
              <div>FR</div>
              <div>SA</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day) => {
                const itemHasMeeting = meetings.some((meeting) =>
                  isSameDay(parseISO(meeting.startDatetime), day)
                );

                return (
                  <div key={day.toString()} className="py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(day);
                        onItemClick &&
                          onItemClick(
                            meetings.filter((meeting) =>
                              isSameDay(parseISO(meeting.startDatetime), day)
                            ),
                            day
                          );
                      }}
                      className={cc([
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-md",
                        {
                          "hover:bg-gray-500 hover:text-white bg-gray-100":
                            !isEqual(day, selectedDay) && !itemHasMeeting,
                        },
                        {
                          "text-primary":
                            !isEqual(day, selectedDay) &&
                            isToday(day) &&
                            !itemHasMeeting,
                        },
                        {
                          "text-gray-900":
                            !isEqual(day, selectedDay) &&
                            isSameMonth(day, firstDayCurrentMonth) &&
                            !itemHasMeeting,
                        },
                        {
                          "text-gray-400":
                            !isEqual(day, selectedDay) &&
                            !isSameMonth(day, firstDayCurrentMonth) &&
                            !itemHasMeeting,
                        },
                        {
                          "bg-blue-500 text-white": isEqual(day, selectedDay),
                        },
                        {
                          "bg-green-500 text-white hover:bg-green-700":
                            itemHasMeeting && !isEqual(day, selectedDay),
                        },
                      ])}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const RequriesActionItemsList = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white w-full text-center">
      <div className="px-8">
        {items.map((item, index) => {
          const letter = item.Letters[0];
          const today = dayjs(new Date().toUTCString());
          const expiresAt = letter?.waiting_expired_at;
          const difference = expiresAt
            ? today.diff(dayjs(expiresAt), "days")
            : null;

          return (
            <Fragment key={`requires-action-item-card-${index}`}>
              <div className="flex space-evenly font-bold hover:cursor-pointer">
                <div className="flex gap-3">
                  <div>{item.account_name}</div>
                  <div className="text-gray-600">|</div>
                </div>

                {difference !== null && (
                  <div
                    className={cc([
                      "ml-auto text-primary",
                      { "text-green-600": difference >= 0 },
                      { "text-red-600": difference < 0 },
                      ``,
                    ])}
                  >{`${difference} ${
                    +difference.toString().replace("-", "") > 1 ? "days" : "day"
                  }`}</div>
                )}
              </div>

              {/* {!!item.dispute_round &&
                item.status !== CreditItemStatus_Enum.AccountFixed &&
                item.status !== CreditItemStatus_Enum.AccountDeleted && (
                  <>
                    <div className="text-left text-orange-600 font-bold">{`Round #${item.dispute_round}`}</div>
                  </>
                )} */}

              {index < items.length - 1 && (
                <hr className="border-gray-500 my-3" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CalendarComponent);
