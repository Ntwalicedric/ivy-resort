import React, { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateGuestSelector = ({ 
  selectedDates, 
  guestCount, 
  onDatesChange, 
  onGuestCountChange,
  onSearch,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState(selectedDates?.checkIn ? new Date(selectedDates.checkIn) : null);
  const [endDate, setEndDate] = useState(selectedDates?.checkOut ? new Date(selectedDates.checkOut) : null);
  const [isDesktop, setIsDesktop] = useState(false);
  const useInlineCalendar = !isDesktop;
  const [pickingPhase, setPickingPhase] = useState(null); // 'start' | 'end' | null

  useEffect(() => {
    const mql = window?.matchMedia?.('(min-width: 640px)');
    const update = () => setIsDesktop(!!mql?.matches);
    update();
    mql?.addEventListener?.('change', update);
    return () => mql?.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    setStartDate(selectedDates?.checkIn ? new Date(selectedDates.checkIn) : null);
    setEndDate(selectedDates?.checkOut ? new Date(selectedDates.checkOut) : null);
  }, [selectedDates?.checkIn, selectedDates?.checkOut]);

  const toISODate = (dateObj) => dateObj ? new Date(dateObj)?.toISOString()?.split('T')?.[0] : '';

  const guestOptions = [
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '3', label: '3 Guests' },
    { value: '4', label: '4 Guests' },
    { value: '5', label: '5 Guests' },
    { value: '6', label: '6 Guests' },
    { value: '7', label: '7 Guests' },
    { value: '8', label: '8+ Guests' }
  ];

  const handleDateChange = (field, value) => {
    onDatesChange({
      ...selectedDates,
      [field]: value
    });
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Select date';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!selectedDates?.checkIn || !selectedDates?.checkOut) return 0;
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isSearchEnabled = selectedDates?.checkIn && selectedDates?.checkOut && guestCount;

  return (
    <div className={`bg-background luxury-shadow rounded-xl border border-border ${className}`}>
      {/* Compact View */}
      <div className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* Check-in */}
            <div
              className="flex items-center space-x-2 min-w-[140px] order-1 basis-1/2 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Open calendar to change check-in and check-out dates"
              onClick={() => { setIsExpanded(true); setPickingPhase('start'); if (!useInlineCalendar) setIsCalendarOpen(true); }}
              onKeyDown={(e) => { if (e?.key === 'Enter' || e?.key === ' ') { e?.preventDefault(); setIsExpanded(true); setPickingPhase('start'); if (!useInlineCalendar) setIsCalendarOpen(true); } }}
            >
              <Icon name="Calendar" size={16} className={pickingPhase === 'start' ? 'text-secondary' : 'text-accent'} />
              <div>
                <div className={`text-xs ${pickingPhase === 'start' ? 'text-secondary' : 'text-muted-foreground'}`}>Check-in</div>
                <div className={`font-medium ${pickingPhase === 'start' ? 'text-secondary' : 'text-foreground'}`}>
                  {formatDateDisplay(selectedDates?.checkIn)}
                </div>
              </div>
            </div>

            {/* Nights */}
            {calculateNights() > 0 && (
              <div className="hidden sm:flex items-center space-x-2 min-w-[120px] order-3">
                <Icon name="Moon" size={16} className="text-accent" />
                <div>
                  <div className="text-xs text-muted-foreground">Nights</div>
                  <div className="font-medium text-foreground">
                    {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}

            {/* Check-out */}
            <div
              className="flex items-center space-x-2 min-w-[140px] order-2 basis-1/2 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Open calendar to change check-in and check-out dates"
              onClick={() => { setIsExpanded(true); setPickingPhase('end'); if (!useInlineCalendar) setIsCalendarOpen(true); }}
              onKeyDown={(e) => { if (e?.key === 'Enter' || e?.key === ' ') { e?.preventDefault(); setIsExpanded(true); setPickingPhase('end'); if (!useInlineCalendar) setIsCalendarOpen(true); } }}
            >
              <Icon name="Calendar" size={16} className={pickingPhase === 'end' ? 'text-secondary' : 'text-accent'} />
              <div>
                <div className={`text-xs ${pickingPhase === 'end' ? 'text-secondary' : 'text-muted-foreground'}`}>Check-out</div>
                <div className={`font-medium ${pickingPhase === 'end' ? 'text-secondary' : 'text-foreground'}`}>
                  {formatDateDisplay(selectedDates?.checkOut)}
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center space-x-2 min-w-[120px] order-5 basis-1/2">
              <Icon name="Users" size={16} className="text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Guests</div>
                <div className="font-medium text-foreground">
                  {guestCount} guest{guestCount > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2 order-4 sm:order-none sm:ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "Edit"}
              iconPosition="left"
              className="sm:w-auto"
            >
              {isExpanded ? 'Collapse' : 'Modify'}
            </Button>

            {isSearchEnabled && (
              <Button
                variant="default"
                size="sm"
                onClick={onSearch}
                iconName="Search"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90 sm:w-auto"
                fullWidth
              >
                Update Search
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Expanded Form */}
      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 md:col-span-3">
              <div className="text-sm text-muted-foreground mb-1">Select dates</div>
              <div className="rounded-md border border-border bg-background p-2">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates || [];
                    setStartDate(start || null);
                    setEndDate(end || null);
                    onDatesChange({
                      checkIn: toISODate(start),
                      checkOut: toISODate(end)
                    });
                    if (start && !end) {
                      setPickingPhase('end');
                    }
                    if (end) {
                      setPickingPhase(null);
                      // Close calendar on both desktop and mobile
                      setIsCalendarOpen(false);
                      setIsExpanded(false);
                    }
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  monthsShown={isDesktop ? 2 : 1}
                  minDate={new Date()}
                  withPortal={!useInlineCalendar && !isDesktop}
                  placeholderText="Choose check-in and check-out"
                  dateFormat="MMM d, yyyy"
                  shouldCloseOnSelect={!!endDate}
                  inline={useInlineCalendar}
                  calendarClassName={useInlineCalendar ? 'react-datepicker--mobile w-full' : undefined}
                  showPopperArrow={isDesktop}
                  open={!useInlineCalendar ? isCalendarOpen : undefined}
                  onClickOutside={!useInlineCalendar ? () => setIsCalendarOpen(false) : undefined}
                  onCalendarClose={!useInlineCalendar ? () => setIsCalendarOpen(false) : undefined}
                  className="w-full"
                />
              </div>
            </div>

            <Select
              label="Number of Guests"
              options={guestOptions}
              value={guestCount}
              onChange={onGuestCountChange}
              required
            />

            <div className="flex items-end">
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  onSearch();
                  setIsExpanded(false);
                }}
                disabled={!isSearchEnabled}
                iconName="Search"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90"
              >
                Search Rooms
              </Button>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground mb-2">Quick Select:</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Tonight', nights: 1 },
                { label: 'This Weekend', nights: 2 },
                { label: 'Next Week', nights: 7 },
                { label: 'Two Weeks', nights: 14 }
              ]?.map((preset) => (
                <Button
                  key={preset?.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const checkIn = new Date(today);
                    const checkOut = new Date(today);
                    checkOut?.setDate(checkOut?.getDate() + preset?.nights);
                    
                    onDatesChange({
                      checkIn: checkIn?.toISOString()?.split('T')?.[0],
                      checkOut: checkOut?.toISOString()?.split('T')?.[0]
                    });
                  }}
                  className="text-xs"
                >
                  {preset?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateGuestSelector;