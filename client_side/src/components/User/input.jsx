/* eslint-disable react/prop-types */
import { FaExclamationCircle } from "react-icons/fa";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

function InputTag({ data, formik }) {
  return (
    <>
      {data.map((elm, i) => (
        <div key={i} className="relative">
          <Input
            size="lg"
            label={elm.label}
            name={elm.name}
            type={elm.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[elm.name]}
          />
          {formik.touched[elm.name] && formik.errors[elm.name] ? (
            <Popover placement="right">
              <PopoverHandler>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaExclamationCircle className="text-red-400 hover:cursor-pointer" />
                </span>
              </PopoverHandler>
              <PopoverContent>
                <span>
                  {formik.touched[elm.name] && formik.errors[elm.name] && (
                    <small className="text-red-500 text-sm">
                      {formik.errors[elm.name]}
                    </small>
                  )}
                </span>
              </PopoverContent>
            </Popover>
          ) : (
            ""
          )}
        </div>
      ))}
    </>
  );
}

function ItineryErrorValidations({ day, index, formik }) {
  return (
    <div className="space-y-4">
      {day.activities.map((activity, activityIndex) => {
        return (
          <div
            key={activityIndex}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <div className="flex-1 relative">
              <Input
                size="lg"
                label={`Day ${day.day} Activity Description`}
                name={`itinerary[${index}].activities[${activityIndex}].description`}
                value={activity.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.itinerary?.[index]?.activities?.[activityIndex]
                ?.description &&
                formik.errors.itinerary?.[index]?.activities?.[activityIndex]
                  ?.description && (
                  <Popover placement="right">
                    <PopoverHandler>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 ">
                        <FaExclamationCircle className="text-red-400 hover:cursor-pointer" />
                      </span>
                    </PopoverHandler>
                    <PopoverContent>
                      <span>
                        <small className="text-red-500 text-sm">
                          {
                            formik.errors.itinerary?.[index]?.activities?.[
                              activityIndex
                            ]?.description
                          }
                        </small>
                      </span>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
            <div className="flex-.5 relative">
              <Input
                type="time"
                size="lg"
                label={`Day ${day.day} Activity Start Time`}
                name={`itinerary[${index}].activities[${activityIndex}].startTime`}
                value={activity.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
             {formik.touched.itinerary?.[index]?.activities?.[activityIndex]
                ?.startTime &&
                formik.errors.itinerary?.[index]?.activities?.[activityIndex]
                  ?.startTime && (
                  <Popover placement="right">
                    <PopoverHandler>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 ">
                        <FaExclamationCircle className="text-red-400 hover:cursor-pointer" />
                      </span>
                    </PopoverHandler>
                    <PopoverContent>
                      <span>
                        
                        <small className="text-red-500 text-sm">
                        {
                            formik.errors.itinerary?.[index]?.activities?.[
                              activityIndex
                            ]?.startTime
                          }
                        </small>
                        
                      </span>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
            <div className="flex-.5 relative">
              <Input
                type="time"
                size="lg"
                label={`Day ${day.day} Activity End Time`}
                name={`itinerary[${index}].activities[${activityIndex}].endTime`}
                value={activity.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
             {formik.touched.itinerary?.[index]?.activities?.[activityIndex]
                ?.endTime &&
                formik.errors.itinerary?.[index]?.activities?.[activityIndex]
                  ?.endTime && (
                  <Popover placement="right">
                    <PopoverHandler>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 ">
                        <FaExclamationCircle className="text-red-400 hover:cursor-pointer" />
                      </span>
                    </PopoverHandler>
                    <PopoverContent>
                      <span>
                        
                        <small className="text-red-500 text-sm">
                        {
                            formik.errors.itinerary?.[index]?.activities?.[
                              activityIndex
                            ]?.endTime
                          }
                        </small>
                        
                      </span>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { InputTag, ItineryErrorValidations };
