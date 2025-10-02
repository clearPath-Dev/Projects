#!/usr/bin/env bash

# System Health Snapshot Tool

VERSION="1.0.0"
SCRIPT_NAME=$(basename "$0")

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Display usage information
show_help() {
    cat << EOF
${BOLD}System Health Snapshot Tool v${VERSION}${NC}

Usage: ${SCRIPT_NAME} [OPTIONS]

Options:
    -a, --all           Show all metrics (default)
    -c, --cpu           Show CPU information
    -m, --memory        Show memory usage
    -d, --disk          Show disk usage
    -n, --network       Show network statistics
    -p, --processes     Show top processes
    -s, --services      Show critical service status
    -t, --temperature   Show system temperatures
    -u, --uptime        Show system uptime
    -l, --load          Show system load averages
    -o, --output FILE   Save output to file
    -j, --json          Output in JSON format
    -h, --help          Display this help message
    -v, --version       Show version information

Examples:
    ${SCRIPT_NAME} -a              # Show all metrics
    ${SCRIPT_NAME} -c -m -d        # Show CPU, memory, and disk only
    ${SCRIPT_NAME} -a -o health.txt    # Save full report to file
    ${SCRIPT_NAME} -j              # Output in JSON format

EOF
}

# Display version
show_version() {
    echo "${SCRIPT_NAME} version ${VERSION}"
}

# Print section header
print_header() {
    echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}$1${NC}"
    echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Get status color based on percentage
get_status_color() {
    local value=$1
    local threshold_warn=${2:-70}
    local threshold_crit=${3:-90}
    
    # Use awk for portable floating point comparison
    local is_crit=$(awk -v val="$value" -v crit="$threshold_crit" 'BEGIN {print (val >= crit) ? 1 : 0}')
    local is_warn=$(awk -v val="$value" -v warn="$threshold_warn" 'BEGIN {print (val >= warn) ? 1 : 0}')
    
    if [ "$is_crit" -eq 1 ]; then
        echo "$RED"
    elif [ "$is_warn" -eq 1 ]; then
        echo "$YELLOW"
    else
        echo "$GREEN"
    fi
}

# Show system uptime and boot time
show_uptime() {
    print_header "⏱  SYSTEM UPTIME"
    
    local uptime_info=$(uptime -p 2>/dev/null || uptime)
    local boot_time=$(who -b 2>/dev/null | awk '{print $3, $4}')
    
    echo -e "${BOLD}Uptime:${NC} $uptime_info"
    [ -n "$boot_time" ] && echo -e "${BOLD}Boot Time:${NC} $boot_time"
    echo -e "${BOLD}Current Time:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
}

# Show system load averages
show_load() {
    print_header "📊 SYSTEM LOAD"
    
    if [ -f /proc/loadavg ]; then
        read load1 load5 load15 _ _ < /proc/loadavg
    else
        local load_str=$(uptime | sed 's/.*load averages*: //')
        load1=$(echo $load_str | awk '{print $1}' | tr -d ',')
        load5=$(echo $load_str | awk '{print $2}' | tr -d ',')
        load15=$(echo $load_str | awk '{print $3}' | tr -d ',')
    fi
    
    local cpu_count=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || grep -c processor /proc/cpuinfo 2>/dev/null || echo 1)
    
    local load1_pct=$(awk -v load="$load1" -v cpus="$cpu_count" 'BEGIN {printf "%.2f", (load / cpus) * 100}')
    local color=$(get_status_color "$load1_pct" 70 100)
    
    echo -e "${BOLD}CPU Cores:${NC} $cpu_count"
    echo -e "${BOLD}Load Average:${NC} ${color}${load1}${NC} (1m), ${load5} (5m), ${load15} (15m)"
    echo -e "${BOLD}Load %:${NC} ${color}${load1_pct}%${NC} of capacity"
}

# Show CPU information
show_cpu() {
    print_header "🖥  CPU INFORMATION"
    
    if [ -f /proc/cpuinfo ]; then
        local model=$(grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)
        local cores=$(nproc)
        local threads=$(grep -c processor /proc/cpuinfo)
        
        echo -e "${BOLD}Model:${NC} $model"
        echo -e "${BOLD}Cores:${NC} $cores"
        echo -e "${BOLD}Threads:${NC} $threads"
    fi
    
    # CPU usage
    if command -v mpstat &> /dev/null; then
        local cpu_usage=$(mpstat 1 1 | awk '/Average/ {print 100-$NF}')
        local color=$(get_status_color "$cpu_usage")
        echo -e "${BOLD}Usage:${NC} ${color}${cpu_usage}%${NC}"
    elif [ -f /proc/stat ]; then
        local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
        local color=$(get_status_color "$cpu_usage")
        echo -e "${BOLD}Usage:${NC} ${color}${cpu_usage}%${NC}"
    fi
}

# Show memory usage
show_memory() {
    print_header "💾 MEMORY USAGE"
    
    if [ -f /proc/meminfo ]; then
        # Linux
        local total=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
        local available=$(awk '/MemAvailable/ {print $2}' /proc/meminfo)
        local free=$(awk '/MemFree/ {print $2}' /proc/meminfo)
        local buffers=$(awk '/Buffers/ {print $2}' /proc/meminfo)
        local cached=$(awk '/^Cached/ {print $2}' /proc/meminfo)
        
        local used=$((total - available))
        local used_pct=$(awk -v used="$used" -v total="$total" 'BEGIN {printf "%.2f", (used * 100) / total}')
        
        local color=$(get_status_color "$used_pct")
        
        echo -e "${BOLD}Total:${NC} $(numfmt --to=iec-i --suffix=B $((total * 1024)) 2>/dev/null || echo "$((total / 1024)) MB")"
        echo -e "${BOLD}Used:${NC} ${color}$(numfmt --to=iec-i --suffix=B $((used * 1024)) 2>/dev/null || echo "$((used / 1024)) MB")${NC} (${color}${used_pct}%${NC})"
        echo -e "${BOLD}Available:${NC} $(numfmt --to=iec-i --suffix=B $((available * 1024)) 2>/dev/null || echo "$((available / 1024)) MB")"
        echo -e "${BOLD}Free:${NC} $(numfmt --to=iec-i --suffix=B $((free * 1024)) 2>/dev/null || echo "$((free / 1024)) MB")"
        echo -e "${BOLD}Buffers/Cache:${NC} $(numfmt --to=iec-i --suffix=B $(((buffers + cached) * 1024)) 2>/dev/null || echo "$(((buffers + cached) / 1024)) MB")"
        
        # Swap info
        local swap_total=$(awk '/SwapTotal/ {print $2}' /proc/meminfo)
        local swap_free=$(awk '/SwapFree/ {print $2}' /proc/meminfo)
        local swap_used=$((swap_total - swap_free))
        
        if [ "$swap_total" -gt 0 ]; then
            local swap_pct=$(awk -v used="$swap_used" -v total="$swap_total" 'BEGIN {printf "%.2f", (used * 100) / total}')
            local swap_color=$(get_status_color "$swap_pct")
            echo -e "\n${BOLD}Swap Total:${NC} $(numfmt --to=iec-i --suffix=B $((swap_total * 1024)) 2>/dev/null || echo "$((swap_total / 1024)) MB")"
            echo -e "${BOLD}Swap Used:${NC} ${swap_color}$(numfmt --to=iec-i --suffix=B $((swap_used * 1024)) 2>/dev/null || echo "$((swap_used / 1024)) MB")${NC} (${swap_color}${swap_pct}%${NC})"
        fi
    elif command -v vm_stat &>/dev/null; then
        # macOS
        local page_size=$(pagesize 2>/dev/null || sysctl -n hw.pagesize 2>/dev/null || echo 4096)
        local vm_stat_output=$(vm_stat)
        
        local pages_free=$(echo "$vm_stat_output" | awk '/Pages free/ {print $3}' | tr -d '.')
        local pages_active=$(echo "$vm_stat_output" | awk '/Pages active/ {print $3}' | tr -d '.')
        local pages_inactive=$(echo "$vm_stat_output" | awk '/Pages inactive/ {print $3}' | tr -d '.')
        local pages_wired=$(echo "$vm_stat_output" | awk '/Pages wired down/ {print $4}' | tr -d '.')
        
        local mem_total=$(sysctl -n hw.memsize 2>/dev/null || echo 0)
        local mem_used=$(( (pages_active + pages_wired + pages_inactive) * page_size ))
        local mem_free=$(( pages_free * page_size ))
        
        if [ "$mem_total" -gt 0 ]; then
            local used_pct=$(awk -v used="$mem_used" -v total="$mem_total" 'BEGIN {printf "%.2f", (used * 100) / total}')
            local color=$(get_status_color "$used_pct")
            
            echo -e "${BOLD}Total:${NC} $((mem_total / 1024 / 1024)) MB"
            echo -e "${BOLD}Used:${NC} ${color}$((mem_used / 1024 / 1024)) MB${NC} (${color}${used_pct}%${NC})"
            echo -e "${BOLD}Free:${NC} $((mem_free / 1024 / 1024)) MB"
        fi
    else
        echo "  Memory information not available"
    fi
}

# Show disk usage
show_disk() {
    print_header "💿 DISK USAGE"
    
    echo -e "${BOLD}Filesystem${NC}           ${BOLD}Size${NC}    ${BOLD}Used${NC}   ${BOLD}Avail${NC}  ${BOLD}Use%${NC}  ${BOLD}Mounted on${NC}"
    echo "────────────────────────────────────────────────────────────────"
    
    df -h | grep -E "^/dev/" | while read line; do
        local fs=$(echo $line | awk '{print $1}')
        local size=$(echo $line | awk '{print $2}')
        local used=$(echo $line | awk '{print $3}')
        local avail=$(echo $line | awk '{print $4}')
        local use_pct=$(echo $line | awk '{print $5}' | tr -d '%')
        local mount=$(echo $line | awk '{print $6}')
        
        local color=$(get_status_color "$use_pct")
        
        printf "%-20s %6s  %6s  %6s  ${color}%4s%%${NC}  %s\n" \
            "$fs" "$size" "$used" "$avail" "$use_pct" "$mount"
    done
    
    # Show inode usage
    echo -e "\n${BOLD}Inode Usage:${NC}"
    df -i | grep -E "^/dev/" | awk 'NR==1 || $5+0 > 50' | while read line; do
        local use_pct=$(echo $line | awk '{print $5}' | tr -d '%')
        if [ "$use_pct" != "IUse%" ] && [ "$use_pct" -gt 50 ]; then
            local mount=$(echo $line | awk '{print $6}')
            local color=$(get_status_color "$use_pct")
            echo -e "  ${mount}: ${color}${use_pct}%${NC}"
        fi
    done
}

# Show network statistics
show_network() {
    print_header "🌐 NETWORK STATISTICS"
    
    echo -e "${BOLD}Active Interfaces:${NC}"
    ip -br addr 2>/dev/null | grep -v "^lo" | while read iface status addr rest; do
        echo -e "  ${BOLD}${iface}${NC}: ${status} - ${addr}"
    done
    
    echo -e "\n${BOLD}Network Traffic:${NC}"
    if [ -f /proc/net/dev ]; then
        awk 'NR>2 && !/lo:/ {
            printf "  %-10s RX: %10.2f MB  TX: %10.2f MB\n", 
            $1, $2/1024/1024, $10/1024/1024
        }' /proc/net/dev
    fi
    
    # Show listening ports
    echo -e "\n${BOLD}Listening Ports:${NC}"
    if command -v ss &> /dev/null; then
        ss -tlnp 2>/dev/null | grep LISTEN | awk '{print $4}' | cut -d: -f2 | sort -n | uniq | head -10 | tr '\n' ' '
        echo
    elif command -v netstat &> /dev/null; then
        netstat -tlnp 2>/dev/null | grep LISTEN | awk '{print $4}' | cut -d: -f2 | sort -n | uniq | head -10 | tr '\n' ' '
        echo
    fi
}

# Show top processes
show_processes() {
    print_header "⚙️  TOP PROCESSES"
    
    echo -e "${BOLD}By CPU:${NC}"
    if ps aux &>/dev/null; then
        ps aux | sort -nrk 3 | head -6 | awk '{printf "  %-8s %5s%% %5s%% %s\n", $1, $3, $4, $11}'
    else
        ps -eo user,%cpu,%mem,comm | sort -nrk 2 | head -6 | awk '{printf "  %-8s %5s%% %5s%% %s\n", $1, $2, $3, $4}'
    fi
    
    echo -e "\n${BOLD}By Memory:${NC}"
    if ps aux &>/dev/null; then
        ps aux | sort -nrk 4 | head -6 | awk '{printf "  %-8s %5s%% %5s%% %s\n", $1, $3, $4, $11}'
    else
        ps -eo user,%cpu,%mem,comm | sort -nrk 3 | head -6 | awk '{printf "  %-8s %5s%% %5s%% %s\n", $1, $2, $3, $4}'
    fi
    
    local proc_count=$(ps -e | wc -l)
    echo -e "\n${BOLD}Process Count:${NC} $proc_count"
}

# Show critical service status
show_services() {
    print_header "🔧 SERVICE STATUS"
    
    local services=("sshd" "ssh" "cron" "crond" "docker" "nginx" "apache2" "httpd" "mysql" "mysqld" "postgresql" "postgres")
    
    if command -v systemctl &>/dev/null; then
        # systemd systems
        for service in "${services[@]}"; do
            if systemctl list-unit-files 2>/dev/null | grep -q "^${service}.service"; then
                local status=$(systemctl is-active "$service" 2>/dev/null)
                if [ "$status" = "active" ]; then
                    echo -e "  ${GREEN}●${NC} ${service}: ${GREEN}active${NC}"
                elif [ "$status" = "inactive" ]; then
                    echo -e "  ${YELLOW}●${NC} ${service}: ${YELLOW}inactive${NC}"
                else
                    echo -e "  ${RED}●${NC} ${service}: ${RED}failed${NC}"
                fi
            fi
        done
    elif command -v service &>/dev/null; then
        # SysV init systems
        for service in "${services[@]}"; do
            if service --status-all 2>/dev/null | grep -q "$service"; then
                local status=$(service "$service" status 2>/dev/null)
                if echo "$status" | grep -iq "running\|active"; then
                    echo -e "  ${GREEN}●${NC} ${service}: ${GREEN}running${NC}"
                else
                    echo -e "  ${YELLOW}●${NC} ${service}: ${YELLOW}stopped${NC}"
                fi
            fi
        done
    elif [ "$(uname)" = "Darwin" ]; then
        # macOS - check for common services
        echo "  Service monitoring limited on macOS"
        for service in "${services[@]}"; do
            if pgrep -x "$service" >/dev/null 2>&1; then
                echo -e "  ${GREEN}●${NC} ${service}: ${GREEN}running${NC}"
            fi
        done
    else
        # Fallback - just check if processes are running
        echo "  Using process-based service detection:"
        for service in "${services[@]}"; do
            if pgrep -f "$service" >/dev/null 2>&1; then
                echo -e "  ${GREEN}●${NC} ${service}: ${GREEN}running${NC}"
            fi
        done
    fi
}

# Show temperature information
show_temperature() {
    print_header "🌡  TEMPERATURE"
    
    local found_temp=false
    
    # Try lm-sensors first
    if command -v sensors &>/dev/null; then
        local sensor_output=$(sensors 2>/dev/null)
        if [ -n "$sensor_output" ]; then
            echo "$sensor_output" | grep -E "(Core|temp|fan)" | head -10
            found_temp=true
        fi
    fi
    
    # Try thermal zones (Linux)
    if [ "$found_temp" = false ] && [ -d /sys/class/thermal ]; then
        for zone in /sys/class/thermal/thermal_zone*/temp; do
            if [ -f "$zone" ]; then
                local temp=$(cat "$zone" 2>/dev/null)
                if [ -n "$temp" ] && [ "$temp" -gt 0 ]; then
                    temp=$((temp / 1000))
                    local zone_name=$(basename $(dirname "$zone"))
                    local color=$(get_status_color "$temp" 70 85)
                    echo -e "  ${zone_name}: ${color}${temp}°C${NC}"
                    found_temp=true
                fi
            fi
        done
    fi
    
    # Try macOS temperature (if osx-cpu-temp is installed)
    if [ "$found_temp" = false ] && [ "$(uname)" = "Darwin" ]; then
        if command -v osx-cpu-temp &>/dev/null; then
            osx-cpu-temp 2>/dev/null
            found_temp=true
        fi
    fi
    
    # Try reading ACPI thermal info
    if [ "$found_temp" = false ] && [ -d /proc/acpi/thermal_zone ]; then
        for zone in /proc/acpi/thermal_zone/*/temperature; do
            if [ -f "$zone" ]; then
                local temp_line=$(cat "$zone" 2>/dev/null)
                if [ -n "$temp_line" ]; then
                    echo "  $temp_line"
                    found_temp=true
                fi
            fi
        done
    fi
    
    if [ "$found_temp" = false ]; then
        echo "  Temperature monitoring not available"
        echo "  (Install lm-sensors on Linux or osx-cpu-temp on macOS)"
    fi
}

# Main function
main() {
    local show_all=true
    local show_cpu=false
    local show_mem=false
    local show_disk=false
    local show_net=false
    local show_proc=false
    local show_svc=false
    local show_temp=false
    local show_up=false
    local show_ld=false
    local output_file=""
    local json_output=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -a|--all)
                show_all=true
                shift
                ;;
            -c|--cpu)
                show_all=false
                show_cpu=true
                shift
                ;;
            -m|--memory)
                show_all=false
                show_mem=true
                shift
                ;;
            -d|--disk)
                show_all=false
                show_disk=true
                shift
                ;;
            -n|--network)
                show_all=false
                show_net=true
                shift
                ;;
            -p|--processes)
                show_all=false
                show_proc=true
                shift
                ;;
            -s|--services)
                show_all=false
                show_svc=true
                shift
                ;;
            -t|--temperature)
                show_all=false
                show_temp=true
                shift
                ;;
            -u|--uptime)
                show_all=false
                show_up=true
                shift
                ;;
            -l|--load)
                show_all=false
                show_ld=true
                shift
                ;;
            -o|--output)
                output_file="$2"
                shift 2
                ;;
            -j|--json)
                json_output=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                show_version
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use -h or --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Redirect output if specified
    if [ -n "$output_file" ]; then
        exec > >(tee "$output_file")
    fi
    
    # Display header
    echo -e "${BOLD}${MAGENTA}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║          SYSTEM HEALTH SNAPSHOT - $(date '+%Y-%m-%d %H:%M:%S')          ║"
    echo "║                    Hostname: $(hostname)                    ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Show selected metrics
    if $show_all || $show_up; then show_uptime; fi
    if $show_all || $show_ld; then show_load; fi
    if $show_all || $show_cpu; then show_cpu; fi
    if $show_all || $show_mem; then show_memory; fi
    if $show_all || $show_disk; then show_disk; fi
    if $show_all || $show_net; then show_network; fi
    if $show_all || $show_proc; then show_processes; fi
    if $show_all || $show_svc; then show_services; fi
    if $show_all || $show_temp; then show_temperature; fi
    
    echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Run main function
main "$@"
