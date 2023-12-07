#! /bin/bash

cd /APP/FinPlus/payment_page_backoffice
log_dir=/APP/FinPlus/payment_page_backoffice/Log
dt=$(date +%y%m%d%H%M)
log_file=${log_dir}/PaymentPage.${dt}.log
PUBLIC_URL=/payment

serve -s build -l 3100 >> ${log_file} 2>&1